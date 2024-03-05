import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { FileContainerModule } from "src/app/components/create-post/file-container/file-container.module";
import { ImageUploadModule } from "src/app/components/create-post/image-upload/image-upload.module";
import { MakePostModule } from "src/app/components/make-post/make-post.module";
import { ProductsSixPopupPage } from "src/app/components/popovers/products-six-popup/products-six-popup.page";
import { ProductsSliderModule } from "src/app/components/post/products-slider/products-slider.module";
import { SocialPreviewModule } from "src/app/components/post/social-preview/social-preview.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { AdvertisementTwoPageRoutingModule } from "./advertisement-two-routing.module";
import { AdvertisementTwoPage } from "./advertisement-two.page";

// import { AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvertisementTwoPageRoutingModule,
    SanitizeImagePipeModule,
    GetPricePipeModule,
    GetImageModule,
    LazyLoadImageModule,
    SocialPreviewModule,
    MakePostModule,
    ProductsSliderModule,
    ImageUploadModule,
    FileContainerModule,
  ],
  declarations: [AdvertisementTwoPage, ProductsSixPopupPage],
})
export class AdvertisementTwoPageModule {}
