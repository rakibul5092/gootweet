import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductDetailsPageRoutingModule } from "./product-details-routing.module";

import { DeliveryInfoModule } from "../components/product/delivery-info/delivery-info.module";
import { SliderModule } from "../components/product/slider/slider.module";
import { ProfilePhotoModule } from "../components/utils/profile-photo/profile-photo.module";
import { GetImageModule } from "../pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "../pipes/share-module/get-price-pipe/get-price-pipe.module";
import { ProductDetailsPage } from "./product-details.page";
import { ManufacturerInfoModule } from "../components/manufacturer-info/manufacturer-info.module";
import { NgPipesModule } from "ngx-pipes";
import { MaterialListModule } from "../components/material-list/material-list.module";
import { ProductMoreDirective } from "../directives/product-more.directive";
import { MenuModule } from "../components/menu-items/menu.module";
import { VideoPlayerModule } from "../components/utility-components/video-player/video-player.module";

@NgModule({
  declarations: [ProductDetailsPage, ProductMoreDirective],

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
    GetImageModule,
    GetPricePipeModule,
    DeliveryInfoModule,
    ProfilePhotoModule,
    SliderModule,
    ManufacturerInfoModule,
    NgPipesModule,
    MaterialListModule,
    MenuModule,
    VideoPlayerModule,
  ],
  providers: [ProductMoreDirective],
})
export class ProductDetailsPageModule {}
