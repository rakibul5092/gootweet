import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductForChat } from "src/app/models/product";

@Component({
  selector: "app-chat-input",
  templateUrl: "./chat-input.component.html",
  styleUrls: ["./chat-input.component.scss"],
})
export class ChatInputComponent implements OnInit {
  messageText: string;

  @Input() isUploading: boolean;
  @Input() selectedProduct: ProductForChat;
  @Input() isTyping: boolean;

  @Output() onMessageSend = new EventEmitter();
  @Output() onMessageChanged = new EventEmitter();
  @Output() onBrowseImg = new EventEmitter();

  constructor() {}

  sendMessage(param1, param2, flag) {
    this.onMessageSend.emit({ param1, param2, flag });
    this.messageText = "";
  }

  messageTextChanged() {
    this.onMessageChanged.emit(this.messageText);
  }

  onBrowseImage(event) {
    this.onBrowseImg.emit(event);
  }

  ngOnInit() {}
}
