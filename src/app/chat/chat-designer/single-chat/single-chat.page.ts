import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavController, PopoverController } from "@ionic/angular";
import { lazyImage } from "src/app/constants";
import { Product, ProductForChat } from "src/app/models/product";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { ScreenService } from "src/app/services/screen.service";
import {
  openPhoto,
  openPhotoFromArray,
} from "../../../services/functions/functions";
import { ChatService } from "../chat.service";

@Component({
  selector: "app-single-chat",
  templateUrl: "./single-chat.page.html",
  styleUrls: ["./single-chat.page.scss"],
})
export class SingleChatPage implements OnInit {
  @ViewChild("scrollToMe") private scrollToMe: ElementRef;
  openPhoto = openPhoto;
  openPhotoFromArray = openPhotoFromArray;

  constructor(
    public service: ChatService,
    public screen: ScreenService,
    private navController: NavController,
    private popoverController: PopoverController,
    private openProductService: OpenSingleProductService
  ) {}
  default = lazyImage;
  sendMessage({ param1, param2, flag }) {
    this.service.sendMessage(param1, param2, flag);
  }

  ionViewWillEnter() {
    if (this.screen.width.value < 768) {
      this.screen.headerHide.next(true);
      // this.nestedRouter = document.getElementById("nested-router");
      // this.nestedRouter.classList.remove("main-router");
    }
  }
  ionViewWillLeave() {
    if (this.screen.width.value < 768) {
      this.screen.headerHide.next(false);
    }
  }

  ngOnInit() {
    this.service.scrollView = null;
  }
  ngAfterViewChecked() {
    this.service.initScrollView(this.scrollToMe);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
  drop(event) {
    event.preventDefault();
    this.service.selectedProduct = JSON.parse(
      event.dataTransfer.getData("product")
    ) as ProductForChat;
  }
  async openProduct(
    productId: string,
    product: Product,
    productOwnerUid: string,
    isMessenger = true
  ) {
    this.openProductService.openSingleProduct(product, {
      uid: productOwnerUid,
    } as any);
  }

  back() {
    this.navController.back();
  }
}
