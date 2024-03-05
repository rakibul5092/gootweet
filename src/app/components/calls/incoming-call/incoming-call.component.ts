import { Component, Input, OnInit } from "@angular/core";
import { ChatsService } from "src/app/chats/chats.service";
import { IncomingCall } from "src/app/models/call.model";
import { CallService } from "../call.service";
import { ChatService } from "src/app/chat/chat-designer/chat.service";
import { ROLES } from "src/app/constants";

@Component({
  selector: "app-incoming-call",
  templateUrl: "./incoming-call.component.html",
  styleUrls: ["./incoming-call.component.scss"],
})
export class IncomingCallComponent implements OnInit {
  @Input() data: IncomingCall;

  constructor(
    private callService: CallService,
    private chatsService: ChatsService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    const sound = document.getElementById("ringing-sound") as HTMLAudioElement;
    if (sound) sound.play();
  }

  public cancel() {
    this.callService.rejectCall(this.data);
  }

  public async accept() {
    this.callService.acceptCall(this.data);
    this.callService.incomingCall.next(null);
    if (this.data.receiverInfo.rule === ROLES.DESIGNER) {
      this.chatService.openMessageWithCall(this.data.callerInfo, this.data);
    } else {
      this.chatsService.openMessageWithCall(this.data.callerInfo, this.data);
    }
    // this.nav.navigateForward("/designer/video-call-dashboard/" + this.data.id);
  }
}
