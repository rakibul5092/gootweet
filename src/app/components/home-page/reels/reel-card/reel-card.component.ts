import { Component, Input, OnInit } from "@angular/core";
import { Cloudinary } from "@cloudinary/url-gen";
import { REELS_THUMB } from "src/app/constants";
import { Reel } from "src/app/models/reels.model";
import { UtilityService } from "src/app/services/utility.service";
import { ReelsService } from "../reels.service";

@Component({
  selector: "app-reel-card",
  templateUrl: "./reel-card.component.html",
  styleUrls: ["./reel-card.component.scss"],
})
export class ReelCardComponent implements OnInit {
  @Input() reel: Reel;
  @Input() width: number = 196;
  @Input() height: number = 360;
  @Input() isMyReel = false;
  @Input() playable = false;
  public thumbBase = REELS_THUMB;
  public thumbnailUrl: any;
  constructor(
    private reelsService: ReelsService,
    private utils: UtilityService
  ) {}

  ngOnInit() {
    this.generateThumbnailUrl(this.reel.asset.public_id);
  }
  generateThumbnailUrl(publicId: string) {
    const cl = new Cloudinary({ cloud: { cloudName: "ddvayajgr" } }); // Replace 'your_cloud_name' with your actual Cloudinary cloud name
    this.thumbnailUrl = cl
      .video(publicId + ".jpg")
      .quality(60)
      .setAssetType("video")
      .toURL();
  }

  async onDelete(event) {
    event?.stopPropagation();
    const alert = await this.utils.askDeletePermission();
    await alert.onDidDismiss().then((res: any) => {
      if (res?.data?.confirm) {
        this.reelsService.deleteReelById(this.reel.id, this.reel.asset);
      }
    });
  }
}
