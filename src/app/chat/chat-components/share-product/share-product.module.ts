import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "../../../pipes/share-module/get-price-pipe/get-price-pipe.module";
import { ShareProductComponent } from "./share-product.component";

@NgModule({
  declarations: [ShareProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    GetImageModule,
    GetPricePipeModule,
    LazyLoadImageModule,
  ],
  exports: [ShareProductComponent],
})
export class ShareProductModule {}
