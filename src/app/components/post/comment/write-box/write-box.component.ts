import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { User } from "src/app/models/user";
import { Comment, WallPost } from "src/app/models/wall-test";
import { GiphyService } from "src/app/services/giphy.service";

@Component({
  selector: "app-write-box",
  templateUrl: "./write-box.component.html",
  styleUrls: ["./write-box.component.scss"],
})
export class WriteBoxComponent implements OnInit {
  @Input() isReply = false;
  @Input() me: User;
  @Input() comment: Comment;
  @Input() wallPost: WallPost;
  @Input() text: string;
  @Output() onTyping: EventEmitter<any> = new EventEmitter();
  @Output() onSendReplyComment: EventEmitter<any> = new EventEmitter();
  @Output() onSendComments: EventEmitter<any> = new EventEmitter();
  public giphyResults = [];
  public giphySearchText = "random";
  constructor(private service: GiphyService) {}

  ngOnInit() {}
  public initialGifs() {
    this.service.trendingGifs().subscribe((res: any) => {
      if (res && res.data) {
        this.giphyResults = res.data;
      }
    });
  }
  public startSearchGif(event, initial = false) {
    const searchText = initial ? event : event.target.value;
    if (searchText && searchText.length > 3) {
      this.service.searchGifs(searchText);
      this.service.getGifs().subscribe((res: any) => {
        if (res && res.data) {
          this.giphyResults = res.data;
        }
      });
    }
  }
  async sendGif(gif, modal) {
    console.log(gif);

    if (this.isReply) {
      this.comment.gif = gif;
      this.comment.type = 2;
      this.onSendReplyComment.emit();
    } else {
      this.wallPost.gif = gif;
      this.wallPost.commentType = 2;
      this.onSendComments.emit();
    }
    await modal.dismiss();
  }
  onEditCancel() {
    if (this.isReply) {
      this.comment.replyCommentForEdit = null;
      this.comment.replyCommentText = "";
    } else {
      this.wallPost.commentForEdit = null;
      this.wallPost.commentText = "";
    }
  }

  addEmoji(event) {
    this.text += event.emoji.native;
  }

  onCommentTyping() {
    if (this.isReply) {
      this.onTyping.emit();
    }
  }

  sendComments() {
    if (this.isReply) {
      this.comment.type = 1;
      this.comment.replyCommentText = this.text;
      this.onSendReplyComment.emit();
    } else {
      this.wallPost.commentText = this.text;
      this.wallPost.commentType = 1;
      this.onSendComments.emit();
    }
    setTimeout(() => {
      this.text = "";
    }, 500);
  }
}
