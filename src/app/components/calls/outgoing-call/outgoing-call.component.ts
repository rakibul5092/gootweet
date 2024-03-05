import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { OutgoingCall } from "src/app/models/call.model";
import { CallService } from "../call.service";
import { NavController } from "@ionic/angular";
import { Subject, interval, takeUntil } from "rxjs";
import { ROLES } from "src/app/constants";
import { ChatsService } from "src/app/chats/chats.service";
import { ChatService } from "src/app/chat/chat-designer/chat.service";

@Component({
  selector: "app-outgoing-call",
  templateUrl: "./outgoing-call.component.html",
  styleUrls: ["./outgoing-call.component.scss"],
})
export class OutgoingCallComponent implements OnInit, OnDestroy {
  @Input() data: OutgoingCall;
  private destroy$ = new Subject<boolean>();
  private timer: number = 0;
  private ringTimer$;
  constructor(
    private callService: CallService,
    private chatsService: ChatsService,
    private chatService: ChatService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    const sound = document.getElementById("ringing-sound") as HTMLAudioElement;
    if (sound) sound.play();
    this.callService
      .isReceivedCall(this.data.receiverInfo.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);

        if (res && res.accepted) {
          this.ringTimer$?.unsubscribe();
          if (this.data.callerInfo.rule === ROLES.DESIGNER) {
            this.chatService.openMessageWithCall(
              this.data.receiverInfo,
              this.data
            );
          } else {
            this.chatsService.openMessageWithCall(
              this.data.receiverInfo,
              this.data
            );
          }
          this.callService.outgoingCall.next(null);
        } else if (!res) {
          this.callService.outgoingCall.next(null);
        }
      });

    this.ringTimer$ = interval(1000).subscribe(() => {
      if (this.timer >= 60) {
        this.callService.rejectCall(this.data, true);
        this.ringTimer$.unsubscribe();
      }
      this.timer++;
    });
  }

  public cancel() {
    this.callService.rejectCall(this.data);
  }
}
