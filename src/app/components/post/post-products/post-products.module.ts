import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { PostProductsComponent } from "./post-products.component";
import { ProductsSliderModule } from "../products-slider/products-slider.module";

@NgModule({
  declarations: [PostProductsComponent],
  imports: [
    CommonModule,
    GetPricePipeModule,
    GetImageModule,
    LazyLoadImageModule,
    ProductsSliderModule,
  ],
  exports: [PostProductsComponent],
})
export class PostProductsModule {}
