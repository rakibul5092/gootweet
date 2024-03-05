import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MyReelsPageRoutingModule } from "./my-reels-routing.module";

import { MyReelsPage } from "./my-reels.page";
import { ReelCardModule } from "src/app/components/home-page/reels/reel-card/reel-card.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyReelsPageRoutingModule,
    ReelCardModule,
  ],
  declarations: [MyReelsPage],
})
export class MyReelsPageModule {}
