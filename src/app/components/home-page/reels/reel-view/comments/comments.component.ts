import { Component, Input, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ReelComment } from "src/app/models/reels.model";
import { User } from "src/app/models/user";
import { ReelsService } from "../../reels.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent implements OnInit {
  @Input() me: User;
  @Input() reelId: string;
  @Input() index: number;
  public messageText: string;
  public messages: ReelComment[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(
    private reelsService: ReelsService,
    private modal: ModalController
  ) {}
  ngOnDestroy(): void {
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.reelsService
      .subscribeToLiveMessages(this.reelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((lastMessage) => {
        this.messages = lastMessage;
      });
  }

  public async onSendMessage() {
    if (this.messageText && this.messageText.length > 0) {
      const tempMessage = this.messageText.trim();
      this.messageText = "";
      this.reelsService.reels[this.index].commentCount++;
      await this.reelsService.sendMessage(tempMessage, this.reelId, this.me);
    }
  }

  public async onModalClose() {
    await this.modal.dismiss();
  }
}
