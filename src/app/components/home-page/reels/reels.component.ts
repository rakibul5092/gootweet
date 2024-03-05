import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Reel } from "src/app/models/reels.model";
import { SwiperOptions } from "swiper";
import { ReelsService } from "./reels.service";

@Component({
  selector: "app-reels",
  templateUrl: "./reels.component.html",
  styleUrls: ["./reels.component.scss"],
})
export class ReelsComponent implements OnInit {
  @Input() width: number = 196;
  @Input() height: number = 360;
  config: SwiperOptions = {
    width: this.width,
    height: this.height,
    freeMode: true,
  };
  public reels: Reel[];
  constructor(private nav: NavController, public reelsService: ReelsService) {}

  ngOnInit() {
    if (this.reelsService.reels.length === 0) {
      this.reelsService.getAllReels();
    }
  }

  onReelCardClick(index: number) {
    this.reelsService.selectedIndex = index;
    this.nav.navigateForward(
      "/reel-view?type=reels&index=" +
        index +
        "&id=" +
        this.reelsService.reels[index].id,
      {
        animated: true,
        animationDirection: "forward",
      }
    );
  }
}
