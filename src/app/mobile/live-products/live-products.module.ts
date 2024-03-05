import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LiveProductsPageRoutingModule } from "./live-products-routing.module";

import { LiveProductsPage } from "./live-products.page";
import { VideoPlayerModule } from "src/app/components/utility-components/video-player/video-player.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";
import { LiveModule } from "src/app/components/live/live.module";
import { ProductModule } from "src/app/components/product/product.module";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { EditProductComponent } from "./edit-product/edit-product.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LiveProductsPageRoutingModule,
    VideoPlayerModule,
    SanitizeImagePipeModule,
    ProfilePhotoModule,
    LiveModule,
    ProductModule,
    LazyLoadImageModule,
  ],
  declarations: [LiveProductsPage, EditProductComponent],
})
export class LiveProductsPageModule {}
