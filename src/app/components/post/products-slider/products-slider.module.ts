import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ProductsSliderComponent } from "./products-slider.component";
import { SwiperModule } from "swiper/angular";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";

@NgModule({
  declarations: [ProductsSliderComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    GetImageModule,
    GetPricePipeModule,
  ],
  exports: [ProductsSliderComponent],
})
export class ProductsSliderModule {}
