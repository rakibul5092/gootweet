import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-share-post-popup",
  templateUrl: "./share-post-popup.page.html",
  styleUrls: ["./share-post-popup.page.scss"],
})
export class SharePostPopupPage implements OnInit {
  postTitle: string;
  postDescription: string;
  postImage: string;
  url: string;
  constructor(
    private popover: PopoverController,
    private navParams: NavParams
  ) {}

  close() {
    this.popover.dismiss();
  }

  ngOnInit() {
    if (this.navParams) {
      this.postTitle = this.navParams.get("title");
      this.postDescription = this.navParams.get("description");
      this.url = this.navParams.get("url");
      this.postImage = this.navParams.get("image");
    }
  }
  fb() {
    var facebookWindow = window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" + this.url,
      "facebook-popup",
      "height=450,width=500"
    );
    if (facebookWindow.focus) {
      facebookWindow.focus();
    }
    return false;
  }
  linkedIn() {
    var linkedWindow = window.open(
      "https://www.linkedin.com/cws/share?url=" + this.url
    );
    if (linkedWindow.focus) {
      linkedWindow.focus();
    }
  }
  pinIt() {
    var pinWIndow = window.open(
      "http://pinterest.com/pin/create/link/?url=" + this.url
    );
    if (pinWIndow.focus) {
      pinWIndow.focus();
    }
  }
  whatsApp() {
    var waWindow = window.open(
      "https://api.whatsapp.com/send?text=" + this.url
    );
    if (waWindow.focus) {
      waWindow.focus();
    }
  }
  telegram() {
    var teleWindow = window.open(
      "https://telegram.me/share/url?url=" +
        this.url +
        "&text=" +
        this.postTitle
    );
    if (teleWindow.focus) {
      teleWindow.focus();
    }
  }
  tweet() {
    var tweetWindow = window.open(
      "https://twitter.com/intent/tweet?&url=" + this.url
    );
    if (tweetWindow.focus) {
      tweetWindow.focus();
    }
  }
}
