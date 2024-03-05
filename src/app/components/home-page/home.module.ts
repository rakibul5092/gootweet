import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SwiperModule } from "swiper/angular";
import { MaterialListModule } from "../material-list/material-list.module";
import { PriceModule } from "../price/price.module";
import { ProductModule } from "../product/product.module";
import { ProfilePhotoModule } from "../utils/profile-photo/profile-photo.module";
import { ProfileCardComponent } from "./profile-card/profile-card.component";
import { ProfileSliderComponent } from "./profile-slider/profile-slider.component";
import { SearchBoxComponent } from "./search-box/search-box.component";
import { VideoButtonComponent } from "./video-button/video-button.component";
@NgModule({
  declarations: [
    ProfileSliderComponent,
    SearchBoxComponent,
    VideoButtonComponent,
    ProfileCardComponent,
  ],
  imports: [
    CommonModule,
    SanitizeImagePipeModule,
    FormsModule,
    NgPipesModule,
    IonicModule,
    SwiperModule,
    ProfilePhotoModule,
    ProductModule,
    LazyLoadImageModule,
    GetImageModule,
    PriceModule,
    MaterialListModule,
    GetPricePipeModule,
  ],
  exports: [
    ProfileSliderComponent,
    SearchBoxComponent,
    VideoButtonComponent,
    ProfileCardComponent,
  ],
})
export class HomeModule {}
