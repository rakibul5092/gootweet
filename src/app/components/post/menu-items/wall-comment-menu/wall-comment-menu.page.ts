import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AlertController, NavParams, PopoverController } from "@ionic/angular";
import { comments, reply_comments, wallpost } from "../../../../constants";

@Component({
  selector: "app-wall-comment-menu",
  templateUrl: "./wall-comment-menu.page.html",
  styleUrls: ["./wall-comment-menu.page.scss"],
})
export class WallCommentMenuPage implements OnInit {
  wallId: string;
  myUid: string;
  commentId: string;
  replyId: string;
  constructor(
    private navParams: NavParams,
    private popover: PopoverController,
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.commentId = this.navParams.get("comment_id");
      this.wallId = this.navParams.get("wall_id");
      this.myUid = this.navParams.get("myUid");
      this.replyId = this.navParams.get("reply_id");
    } else {
      this.myUid = null;
    }
  }

  onEditComment() {
    let data = {
      wall_id: this.wallId,
      comment_id: this.commentId,
      reply_id: this.replyId,
      myUid: this.myUid,
    };
    this.popover.dismiss(data);
  }

  async onDeleteComment() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Patvirtinimas!",
      message: "Ar tikrai norite ištrinti?",
      mode: "ios",
      buttons: [
        {
          text: "Nutarukti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Istrinti",
          cssClass: "delete",
          handler: () => {
            if (this.wallId && this.myUid && this.commentId && !this.replyId) {
              this.firestore
                .collection(wallpost)
                .doc(this.wallId)
                .collection(comments)
                .doc(this.commentId)
                .delete()
                .then(() => {
                  console.log("deleted comment");
                });
              let data = {
                deleteFlag: true,
                isComment: true,
                isReply: false,
              };
              this.popover.dismiss(data);
            } else if (
              this.wallId &&
              this.myUid &&
              this.commentId &&
              this.replyId
            ) {
              this.firestore
                .collection(wallpost)
                .doc(this.wallId)
                .collection(comments)
                .doc(this.commentId)
                .collection(reply_comments)
                .doc(this.replyId)
                .delete()
                .then(() => {
                  console.log("deleted reply");
                });
              let data = {
                deleteFlag: true,
                isComment: false,
                isReply: true,
              };
              this.popover.dismiss(data);
            }
          },
        },
      ],
    });
    alert.present();
  }
}
