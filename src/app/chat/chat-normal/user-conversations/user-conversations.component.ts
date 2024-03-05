import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ChatsService } from "src/app/chats/chats.service";
import { Product, ProductForChat } from "src/app/models/product";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { GotoProfileService } from "../../../services/goto-profile.service";
import { CallService } from "src/app/components/calls/call.service";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
@Component({
  selector: "app-user-conversations",
  templateUrl: "./user-conversations.component.html",
  styleUrls: ["./user-conversations.component.scss"],
})
export class UserConversationsComponent implements OnInit {
  public isProductSelection = new BehaviorSubject(false);
  @ViewChild("scrollToMe") public scrollToMe: ElementRef;
  default = "./assets/loading.svg";

  constructor(
    public service: ChatsService,
    private gotoProfileService: GotoProfileService,
    private openProductService: OpenSingleProductService,
    private callService: CallService,
    private nav: NavController
  ) {}

  public makeCall() {
    this.callService.makeCall(this.service.selectedContact, this.service.me);
  }

  public gotoCatalog() {
    this.isProductSelection.next(true);
    this.nav.navigateForward("filter/search/all/products", {
      animated: true,
      animationDirection: "forward",
    });
  }

  sendMessage({ param1, param2, flag }) {
    this.service.sendMessage(param1, param2, flag);
  }

  ngOnInit() {
    this.service.scrollView = null;
  }
  ngOnDestroy(): void {
    this.service.backFromChat();
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

  async openProduct(product: Product, productOwnerUid: string) {
    this.openProductService.openSingleProduct(product, {
      uid: productOwnerUid,
    } as any);
  }

  ngAfterViewChecked() {
    this.service.initScrollView(this.scrollToMe);
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
