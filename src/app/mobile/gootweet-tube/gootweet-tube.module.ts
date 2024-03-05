import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { GootweetTubePageRoutingModule } from "./gootweet-tube-routing.module";

import { GootweetTubePage } from "./gootweet-tube.page";
import { VideoElementModule } from "./video-element/video-element.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GootweetTubePageRoutingModule,
    VideoElementModule,
  ],
  declarations: [GootweetTubePage],
})
export class GootweetTubePageModule {}
