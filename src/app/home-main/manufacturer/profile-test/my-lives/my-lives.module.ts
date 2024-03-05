import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MyLivesPageRoutingModule } from "./my-lives-routing.module";

import { ReelCardModule } from "src/app/components/home-page/reels/reel-card/reel-card.module";
import { MyLivesPage } from "./my-lives.page";
import { VideoElementModule } from "src/app/mobile/gootweet-tube/video-element/video-element.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLivesPageRoutingModule,
    ReelCardModule,
    VideoElementModule,
  ],
  declarations: [MyLivesPage],
})
export class MyLivesPageModule {}
