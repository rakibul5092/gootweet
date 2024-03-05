import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ManufacturerOrderProductsPageRoutingModule } from "./manufacturer-order-products-routing.module";

import { ManufacturerOrderProductsPage } from "./manufacturer-order-products.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerOrderProductsPageRoutingModule,
    GetImageModule,
    SanitizeImagePipeModule,
  ],
  declarations: [ManufacturerOrderProductsPage],
})
export class ManufacturerOrderProductsPageModule {}
