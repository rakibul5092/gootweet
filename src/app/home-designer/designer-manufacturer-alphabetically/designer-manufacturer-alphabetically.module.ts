import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DesignerManufacturerAlphabeticallyPageRoutingModule } from "./designer-manufacturer-alphabetically-routing.module";

import { DesignerManufacturerAlphabeticallyPage } from "./designer-manufacturer-alphabetically.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerManufacturerAlphabeticallyPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [DesignerManufacturerAlphabeticallyPage],
})
export class DesignerManufacturerAlphabeticallyPageModule {}
