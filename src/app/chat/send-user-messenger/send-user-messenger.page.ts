import { Component, OnInit } from "@angular/core";
import { ModalService } from "src/app/services/modal.service";
import { ChatsService } from "../../chats/chats.service";

@Component({
  selector: "app-send-user-messenger",
  templateUrl: "./send-user-messenger.page.html",
  styleUrls: ["./send-user-messenger.page.scss"],
})
export class SendUserMessengerPage implements OnInit {
  constructor(
    public chatsService: ChatsService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.chatsService.initConversationForShare();
  }

  dismiss() {
    this.modalService.dismiss();
  }
  send(contact) {
    contact.sent = true;
    this.chatsService.sendMessageFromMobilePopup(contact.user);
  }
}
