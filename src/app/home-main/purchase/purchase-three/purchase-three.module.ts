import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PurchaseThreePageRoutingModule } from "./purchase-three-routing.module";

import { PurchaseThreePage } from "./purchase-three.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { GetImageModule } from "../../../pipes/share-module/get-image/get-image.module";
import { OrderComponent } from "./order/order.component";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseThreePageRoutingModule,
    SanitizeImagePipeModule,
    ReactiveFormsModule,
    GetImageModule,
    ProfilePhotoModule,
  ],
  declarations: [PurchaseThreePage, OrderComponent],
  providers: [],
})
export class PurchaseThreePageModule {}
