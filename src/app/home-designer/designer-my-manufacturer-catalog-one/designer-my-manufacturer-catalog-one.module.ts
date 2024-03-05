import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DesignerMyManufacturerCatalogOnePageRoutingModule } from "./designer-my-manufacturer-catalog-one-routing.module";

import { DesignerMyManufacturerCatalogOnePage } from "./designer-my-manufacturer-catalog-one.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { ManufacturerComponent } from "src/app/components/manufacturer/manufacturer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerMyManufacturerCatalogOnePageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [DesignerMyManufacturerCatalogOnePage, ManufacturerComponent],
})
export class DesignerMyManufacturerCatalogOnePageModule {}
