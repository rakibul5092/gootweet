import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UserOrderProductsPageRoutingModule } from "./user-order-products-routing.module";

import { UserOrderProductsPage } from "./user-order-products.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserOrderProductsPageRoutingModule,
    SanitizeImagePipeModule,
    GetImageModule,
  ],
  declarations: [UserOrderProductsPage],
})
export class UserOrderProductsPageModule {}
