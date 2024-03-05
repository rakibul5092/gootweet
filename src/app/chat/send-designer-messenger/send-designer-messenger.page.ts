import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { ModalService } from "src/app/services/modal.service";
import { ChatService } from "../chat-designer/chat.service";

@Component({
  selector: "app-send-designer-messenger",
  templateUrl: "./send-designer-messenger.page.html",
  styleUrls: ["./send-designer-messenger.page.scss"],
})
export class SendDesignerMessengerPage implements OnInit {
  isCart: boolean = false;
  //imported functions
  constructor(
    public chatsService: ChatService,
    private modalService: ModalService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.isCart = this.navParams.get("isCart");
    }
    this.chatsService.initConversationForShare();
  }

  dismiss() {
    this.modalService.dismiss();
  }
  async send(contact) {
    contact.sent = true;
    await this.chatsService.addToCart(contact.user);
  }
}
