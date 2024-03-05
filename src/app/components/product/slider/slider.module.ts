import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SliderComponent } from "./slider.component";
import { SwiperModule } from "swiper/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    LazyLoadImageModule,
    GetImageModule,
  ],
  exports: [SliderComponent],
})
export class SliderModule {}
