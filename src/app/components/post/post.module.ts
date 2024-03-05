import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { UrlifyPipeModule } from "src/app/pipes/share-module/urlify/urlify-pipe.module";
import { SwiperModule } from "swiper/angular";
import { GetImageModule } from "../../pipes/share-module/get-image/get-image.module";
import { SharedPipeModule } from "../../pipes/shared-pipe/shared-pipe.module";
import { ReelsModule } from "../home-page/reels/reels.module";
import { SharePostPopupPage } from "../popovers/share-post-popup/share-post-popup.page";
import { ProfilePhotoModule } from "../utils/profile-photo/profile-photo.module";
import { CommentContentComponent } from "./comment/comment-content/comment-content.component";
import { CommentComponent } from "./comment/comment.component";
import { WriteBoxComponent } from "./comment/write-box/write-box.component";
import { MenuItemsModule } from "./menu-items/menu-items.module";
import { PostImagesComponent } from "./post-images/post-images.component";
import { PostProductsModule } from "./post-products/post-products.module";
import { PostSkeletonComponent } from "./post-skeleton/post-skeleton.component";
import { PostComponent } from "./post.component";
import { SocialPreviewModule } from "./social-preview/social-preview.module";
import { ReelCardModule } from "../home-page/reels/reel-card/reel-card.module";
import { ProductsSliderModule } from "./products-slider/products-slider.module";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { FileModule } from "../utils/file/file.module";
import { CloudinaryPipeModule } from "src/app/pipes/share-module/cloudinary.module";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";

@NgModule({
  declarations: [
    PostComponent,
    PostImagesComponent,
    PostSkeletonComponent,
    SharePostPopupPage,
    CommentComponent,
    CommentContentComponent,
    WriteBoxComponent,
  ],
  imports: [
    CommonModule,
    SharedPipeModule,
    IonicModule,
    NgPipesModule,
    FormsModule,
    PostProductsModule,
    SanitizeImagePipeModule,
    GetPricePipeModule,
    LazyLoadImageModule,
    GetImageModule,
    UrlifyPipeModule,
    MenuItemsModule,
    SocialPreviewModule,
    SwiperModule,
    ProfilePhotoModule,
    ReelsModule,
    ReelCardModule,
    ProductsSliderModule,
    PickerModule,
    FileModule,
    CloudinaryPipeModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  exports: [PostComponent, PostSkeletonComponent],
})
export class PostModule {}
