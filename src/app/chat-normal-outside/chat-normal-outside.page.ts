import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { conversations, lazyImage, users } from "src/app/constants";
import { Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { UtilityService } from "src/app/services/utility.service";
import { openPhoto, openPhotoFromArray } from "../services/functions/functions";
import { OpenSingleProductService } from "../services/open-single-product.service";
import { ScreenService } from "../services/screen.service";
import { CartPopoverPage } from "./cart-popover/cart-popover.page";
import { ChatOutsideService } from "./chat-outside.service";
import { OptionPage } from "./option/option.page";

@Component({
  selector: "app-chat-normal-outside",
  templateUrl: "./chat-normal-outside.page.html",
  styleUrls: ["./chat-normal-outside.page.scss"],
})
export class ChatNormalOutsidePage implements OnInit {
  @ViewChild("scrollToMe") public scrollToMe: ElementRef;

  openPhoto = openPhoto;
  openPhotoFromArray = openPhotoFromArray;
  constructor(
    public service: ChatOutsideService,
    private utils: UtilityService,
    private popoverController: PopoverController,
    private activatedRoute: ActivatedRoute,
    private screen: ScreenService,
    private openProductService: OpenSingleProductService
  ) {}

  ngOnInit() {
    this.screen.headerHide.next(true);
    this.service.isSingleChat = true;
    this.loadData();
    this.service.scrollView = null;
  }

  loadData() {
    this.service.storage.getOutSideUser().then((user) => {
      this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
        if (params && params.uid && params.pid) {
          this.service.firestore
            .collection(users)
            .doc(params.uid)
            .get()
            .pipe(first())
            .subscribe((query) => {
              let owner = query.data() as User;
              if (query.exists) {
                this.service.productOwnerUid = owner.uid;
                this.service.chatRequest.manufacturer = owner;
                this.service.chatRequest.productId = params.pid;
                this.utils
                  .getProduct(params.uid, params.pid)
                  .pipe(first())
                  .subscribe((query) => {
                    if (query.exists) {
                      this.service.mainProduct = query.data() as Product;
                      this.service.mainProduct.id = params.pid;
                      if (user) {
                        this.service.firestore
                          .collection(conversations)
                          .doc(user.uid)
                          .collection(conversations, (ref) =>
                            ref.where("isNew", "==", true)
                          )
                          .get()
                          .pipe(first())
                          .subscribe((query) => {
                            if (query.docs.length > 0) {
                              this.service.initConversationList(true);
                            }
                          });
                      }
                    } else {
                      this.utils.showAlert(
                        "Klaida",
                        "Produktas neegzistuoja arba ištrintas."
                      );
                    }
                  });
              } else {
                this.utils.showAlert(
                  "Klaida",
                  "Produktas neegzistuoja arba ištrintas."
                );
              }
            });
        }
      });
    });
  }

  async openMenu(ev) {
    let popover = await this.popoverController.create({
      component: OptionPage,
      event: ev,
      translucent: true,
      mode: "ios",
    });
    return popover.present();
  }

  async openCartPopover(event: any) {
    // this.productPopup = true;
    let popover = await this.popoverController.create({
      component: CartPopoverPage,
      event: event,
      cssClass: "chat-pop",
    });
    return await popover.present();
  }

  async openProduct(
    productId: string,
    product: Product,
    productOwnerUid: string
  ) {
    this.openProductService.openSingleProduct(product, {
      uid: productOwnerUid,
    } as any);
  }

  default = lazyImage;

  ngAfterViewChecked() {
    this.service.initScrollView(this.scrollToMe);
  }
}
