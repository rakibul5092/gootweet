import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {PurseReplenishmentPageRoutingModule} from "./purse-replenishment-routing.module";

import {PurseReplenishmentPage} from "./purse-replenishment.page";
import {SanitizeImagePipeModule} from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurseReplenishmentPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [PurseReplenishmentPage],
})
export class PurseReplenishmentPageModule {}
