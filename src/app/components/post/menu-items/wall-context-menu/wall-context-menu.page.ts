import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController, NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-wall-context-menu",
  templateUrl: "./wall-context-menu.page.html",
  styleUrls: ["./wall-context-menu.page.scss"],
})
export class WallContextMenuPage implements OnInit {
  isMe: boolean;
  postId: string;
  myUid: string;
  type: number;
  constructor(
    private navParams: NavParams,
    private nav: NavController,
    private popover: PopoverController
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.isMe = this.navParams.get("isMe");
      this.postId = this.navParams.get("postId");
      this.myUid = this.navParams.get("myUid");
      this.type = this.navParams.get("type");
    } else {
      this.isMe = false;
      this.myUid = null;
    }
  }

  onEditWallPost() {
    this.popover.dismiss();
    if (this.postId && this.isMe && this.myUid) {
      const navExtra: NavigationExtras = {
        queryParams: {
          postId: this.postId,
          type: this.type,
        },
      };
      if (this.type == 1) {
        this.nav.navigateForward("add-post", navExtra);
      } else if (this.type == 4) {
        this.nav.navigateForward(
          "designer/designer-advertisement-two",
          navExtra
        );
      }
    }
  }

  async onDeletePost() {
    return this.popover.dismiss({ action: "delete", wallPostId: this.postId });
  }
}
