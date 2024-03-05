import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SwiperModule } from "swiper/angular";
import { ReelsComponent } from "./reels.component";
import { ReelCardModule } from "./reel-card/reel-card.module";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [ReelsComponent],
  imports: [CommonModule, SwiperModule, ReelCardModule, IonicModule],
  exports: [ReelsComponent],
})
export class ReelsModule {}
