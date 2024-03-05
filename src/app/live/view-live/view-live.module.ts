import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ViewLivePageRoutingModule } from "./view-live-routing.module";

import { ViewLivePage } from "./view-live.page";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";
import { VideoPlayerModule } from "src/app/components/utility-components/video-player/video-player.module";
import { ProductModule } from "src/app/components/product/product.module";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { LiveModule } from "src/app/components/live/live.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewLivePageRoutingModule,
    ProfilePhotoModule,
    VideoPlayerModule,
    ProductModule,
    LazyLoadImageModule,
    GetImageModule,
    GetPricePipeModule,
    SanitizeImagePipeModule,
    LiveModule,
    VideoPlayerModule,
  ],
  declarations: [ViewLivePage],
})
export class ViewLivePageModule {}
