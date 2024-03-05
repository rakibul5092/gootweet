import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { Comment, ReplyComment, WallPost } from "src/app/models/wall-test";
import { getTimestamp } from "src/app/services/functions/functions";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { WallCommentMenuPage } from "../menu-items/wall-comment-menu/wall-comment-menu.page";
import { PostService } from "../post.service";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"],
})
export class CommentComponent implements OnInit {
  @Input() me: User;
  @Input() comment: Comment;
  @Input() wallPost: WallPost;
  constructor(
    private gotoProfileService: GotoProfileService,
    private popoverController: PopoverController,
    private postService: PostService
  ) {}

  ngOnInit() {}

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
  async openCommentMenu({ event, replyComment }, wall: WallPost, comment: any) {
    let data = {
      wall_id: wall?.id,
      comment_id: comment?.id,
      reply_id: replyComment?.id,
      myUid: this.me?.uid,
    };

    let menu = await this.popoverController.create({
      component: WallCommentMenuPage,
      event: event,
      componentProps: data,
      translucent: true,
      mode: "ios",
    });
    menu.onDidDismiss().then((res) => {
      if (res?.data) {
        if (res?.data?.deleteFlag) {
          if (res?.data?.isComment) {
            let index = wall.comments
              .map((item) => item.id)
              .indexOf(comment.id);
            wall.comments.splice(index, 1);
          } else if (res?.data?.isReply) {
            let index = comment.reply_comments
              .map((item) => item.id)
              .indexOf(replyComment.id);
            comment.reply_comments.splice(index, 1);
          }
        } else if (data?.reply_id) {
          if (
            wall.id === data?.wall_id &&
            comment.id == data?.comment_id &&
            replyComment.id == data?.reply_id
          ) {
            comment.replyCommentForEdit = replyComment;
            comment.replyCommentText =
              replyComment?.reply_comment_data?.comment_text;
            comment.replyTo = comment;
            wall.commentText = "";
          }
        } else {
          if (wall.id === data?.wall_id && comment.id === data?.comment_id) {
            wall.commentForEdit = comment;
            wall.commentText = comment?.comment_data?.comment_text;
            comment.replyCommentText = "";
          }
        }
      }
    });
    return await menu.present();
  }
  async scrollTo(element: string) {
    document.getElementById(element)?.scrollIntoView({ block: "end" });
  }

  setReply(comment: any, wallPost: WallPost) {
    wallPost.isCommentAll = true;
    comment.replyTo = comment;
    comment.replyCommentText = "";
    // console.log('scrolling to: ', comment.id);

    // this.scrollTo(comment.id);
  }

  sendReplyComment(wall: WallPost, commenter_uid: string, comment: Comment) {
    if (comment.type === 1 && comment.replyCommentText == "") return;
    wall.isCommentAll = true;
    if (comment.replyCommentForEdit) {
      this.postService.updateReplyComment(wall, comment);
    } else {
      let timestamp = getTimestamp();

      this.postService.sendReplyComment(
        wall.id,
        commenter_uid,
        comment?.id,
        comment.replyCommentText,
        timestamp,
        comment.type,
        comment.gif
      );
    }
    comment.replyCommentForEdit = null;
    comment.replyCommentText = "";
  }
}
