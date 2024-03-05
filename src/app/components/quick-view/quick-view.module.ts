import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { DeliveryInfoModule } from "../product/delivery-info/delivery-info.module";
import { SliderModule } from "../product/slider/slider.module";
import { QuickViewComponent } from "./quick-view.component";

@NgModule({
  declarations: [QuickViewComponent],
  imports: [
    CommonModule,
    IonicModule,
    DeliveryInfoModule,
    GetPricePipeModule,
    SanitizeImagePipeModule,
    SliderModule,
  ],
  exports: [QuickViewComponent],
})
export class QuickViewModule {}
