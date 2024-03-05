import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AdvertisementFourPageRoutingModule } from "./advertisement-four-routing.module";

import { AdvertisementFourPage } from "./advertisement-four.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { TopupModalPage } from "./topup-modal/topup-modal.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvertisementFourPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [AdvertisementFourPage, TopupModalPage],
})
export class AdvertisementFourPageModule {}
