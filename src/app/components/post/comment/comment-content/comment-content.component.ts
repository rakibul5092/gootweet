import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { User } from "src/app/models/user";
import { ReplyComment, WallPost } from "src/app/models/wall-test";
import { GotoProfileService } from "src/app/services/goto-profile.service";

@Component({
  selector: "app-comment-content",
  templateUrl: "./comment-content.component.html",
  styleUrls: ["./comment-content.component.scss"],
})
export class CommentContentComponent implements OnInit {
  @Input() comment: any;
  @Input() isReplyComment = false;
  @Input() me: User;
  @Output() onMenuClick: EventEmitter<any> = new EventEmitter();
  @Output() onReply: EventEmitter<any> = new EventEmitter();
  constructor(private gotoProfileService: GotoProfileService) {}

  ngOnInit() {}
  openCommentMenu(event: any) {
    this.onMenuClick.emit({
      event,
      replyComment: this.isReplyComment ? this.comment : null,
    });
  }
  setReply() {
    this.onReply.emit();
  }
  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
