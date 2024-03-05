import { Injectable } from "@angular/core";
import { ChatService } from "../chat/chat-designer/chat.service";
import { VisibleService } from "../chat/chat-designer/visible.service";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class MessengerService {
  constructor(
    private visibility: VisibleService,
    private chatService: ChatService
  ) {}

  // initialize messanger ...
  openMessenger(me: User) {
    // loading messanger for designer only, in right side...
    if (me?.rule == "designer") {
      if (!this.visibility.isLoaded) {
        this.chatService.initConversationList();
        this.visibility.isLoaded = true;
        this.visibility.isVisible.next(true);
      }
    } else {
      this.visibility.isVisible.next(false);
    }
  }
}
