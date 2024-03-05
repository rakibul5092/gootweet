import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Cloudinary } from "@cloudinary/url-gen";
declare var cloudinary: any;
@Component({
  selector: "app-cloudinary-player",
  templateUrl: "./cloudinary-player.component.html",
  styleUrls: ["./cloudinary-player.component.scss"],
})
export class CloudinaryPlayerComponent implements OnInit, AfterViewInit {
  @Input() publicID: string = "reels/theme_sdlb6i";
  @Input() playerId: string = "cloudinary-player";
  @Input() maxHeight: string = "519px";
  public videoUrl = null;
  constructor() {}

  ngAfterViewInit(): void {
    this.generateThumbnailUrl();
  }

  ngOnInit() {}
  generateThumbnailUrl() {
    const cl = new Cloudinary({ cloud: { cloudName: "ddvayajgr" } }); // Replace 'your_cloud_name' with your actual Cloudinary cloud name
    this.videoUrl = cl
      .video(this.publicID)
      .quality(60)
      .setAssetType("video")
      .toURL();
    // const cld = cloudinary.videoPlayer("cloudinary-player", {
    //   cloud_name: "ddvayajgr",
    // });
    // cld.source({ publicId: this.publicID });
  }
}
