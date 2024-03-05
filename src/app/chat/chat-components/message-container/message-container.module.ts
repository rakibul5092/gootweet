import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { UrlifyPipeModule } from "src/app/pipes/share-module/urlify/urlify-pipe.module";
import { GetPricePipeModule } from "../../../pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "../../../pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SharedPipeModule } from "../../../pipes/shared-pipe/shared-pipe.module";
import { MessageCartComponent } from "../message/message-cart/message-cart.component";
import { MessageFileComponent } from "../message/message-file/message-file.component";
import { MessageImageComponent } from "../message/message-image/message-image.component";
import { MessageImagesComponent } from "../message/message-images/message-images.component";
import { MessageProductComponent } from "../message/message-product/message-product.component";
import { MessageTextComponent } from "../message/message-text/message-text.component";
import { MessageVideoComponent } from "../message/message-video/message-video.component";
import { TimeComponent } from "../message/time/time.component";
import { MessageContainerComponent } from "./message-container.component";
import { ProductDetailsPageModule } from "src/app/product-details/product-details.module";

@NgModule({
  declarations: [
    MessageContainerComponent,
    MessageProductComponent,
    TimeComponent,
    MessageVideoComponent,
    MessageCartComponent,
    MessageImagesComponent,
    MessageFileComponent,
    MessageImageComponent,
    MessageTextComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SanitizeImagePipeModule,
    NgPipesModule,
    GetPricePipeModule,
    LazyLoadImageModule,
    GetImageModule,
    ProductDetailsPageModule,
    SharedPipeModule,
    UrlifyPipeModule,
  ],
  exports: [MessageContainerComponent],
})
export class MessageContainerModule {}
