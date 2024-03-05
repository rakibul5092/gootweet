import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { LIVE_STREAMINGS_PRODUCT_PHOTO_BASE } from "src/app/constants";
import { LiveMessage } from "src/app/models/message";
import { User } from "src/app/models/user";
import { LiveStreamingService } from "src/app/services/live-streaming.service";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"],
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Input() me: User;
  @Input() liveId: string;
  public messageText: string;
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;
  public messages: LiveMessage[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(private streamingService: LiveStreamingService) {}
  ngOnDestroy(): void {
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.streamingService
      .subscribeToLiveMessages(this.liveId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((lastMessage) => {
        this.messages = lastMessage;
      });
  }

  public async onSendMessage() {
    if (this.messageText && this.messageText.length > 0) {
      const tempMessage = this.messageText.trim();
      this.messageText = "";
      await this.streamingService.sendMessage(
        tempMessage,
        this.liveId,
        this.me
      );
    }
  }
}
