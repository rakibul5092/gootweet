import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  LIVE_STREAMING_VIDEOS_BASE,
  wall_post_image_base,
  wall_post_video_base,
} from "src/app/constants";
import { WallPost } from "src/app/models/wall-test";
import { openPhoto } from "src/app/services/functions/functions";
import { ScreenService } from "src/app/services/screen.service";
declare var Hls: any;

@Component({
  selector: "app-post-images",
  templateUrl: "./post-images.component.html",
  styleUrls: ["./post-images.component.scss"],
})
export class PostImagesComponent implements OnInit {
  @Input() wallPost: WallPost;
  @Input() wallId: string;
  public liveVideo = false;
  default = "./assets/loading.svg";
  wall_post_image_base = wall_post_image_base;
  wall_post_video_base = wall_post_video_base;
  live_video_base = LIVE_STREAMING_VIDEOS_BASE;
  length = 0;
  layout = 1;
  public files: { url: string; type: string }[] = [];

  openPhoto = openPhoto;
  constructor(public screen: ScreenService, private nav: NavController) {}

  ngOnInit() {
    this.files = this.wallPost.data.files;
    this.length = this.wallPost.data.files.length;
    this.layout = this.wallPost?.data?.layout || 1;
    this.liveVideo = this.wallPost.data.liveStatus === 1;
  }

  public openLive() {
    this.nav.navigateForward("live-chat/" + this.wallId + "/3", {
      animated: true,
      animationDirection: "forward",
    });
  }

  // gallery: any;
  // openImage() {
  //   this.gallery = new Viewer(document.getElementById("designer-image"));
  //   this.gallery.show();
  // }
}
