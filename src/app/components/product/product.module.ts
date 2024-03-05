import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { PriceModule } from "../price/price.module";
import { ProfilePhotoModule } from "../utils/profile-photo/profile-photo.module";
import { ProductComponent } from "./product.component";

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    GetImageModule,
    GetPricePipeModule,
    LazyLoadImageModule,
    NgPipesModule,
    IonicModule,
    PriceModule,
    SanitizeImagePipeModule,
    ProfilePhotoModule,
    RouterModule,
  ],
  exports: [ProductComponent],
})
export class ProductModule {}
