import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {PursePageRoutingModule} from "./purse-routing.module";

import {PursePage} from "./purse.page";
import {NgPipesModule} from "ngx-pipes";
import {SanitizeImagePipeModule} from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PursePageRoutingModule,
    NgPipesModule,
    SanitizeImagePipeModule,
  ],
  declarations: [PursePage],
})
export class PursePageModule {}
