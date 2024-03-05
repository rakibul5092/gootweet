import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfileTestPageRoutingModule } from "./profile-test-routing.module";

import { ImageCropperModule } from "ngx-image-cropper";
import { NgPipesModule } from "ngx-pipes";
import { BottomSubcatModalPage } from "src/app/components/bottom-subcat-modal/bottom-subcat-modal.page";
import { InnerCategoryListModule } from "src/app/components/inner-category-list/inner-category-list.module";
import { RightSideBarModule } from "src/app/components/layouts/right-side-bar/right-side-bar.module";
import { ManufacturerInfoModule } from "src/app/components/manufacturer-info/manufacturer-info.module";
import { ImageCropperPopoverPageModule } from "src/app/components/popovers/image-cropper-popover/image-cropper-popover.module";
import { PostModule } from "src/app/components/post/post.module";
import { ProductSearchModule } from "src/app/components/product-search/product-search.module";
import { BrowsePhotoComponent } from "src/app/components/utils/browse-photo/browse-photo.component";
import { GetPortfolioImagePipe } from "src/app/pipes/get-portfolio-image.pipe";
import { NamePipe } from "src/app/pipes/name.pipe";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { CatalogPageModule } from "../profile-test/catalog/catalog.module";
import { DesignerInfoPage } from "./designer-info/designer-info.page";
import { DesignerPortfolioComponent } from "./designer-portfolio/designer-portfolio.component";
import { DesignerRatingComponent } from "./designer-rating/designer-rating.component";
import { ProfileTestPage } from "./profile-test.page";
import { TabsAndSearchComponent } from "./tabs-and-search/tabs-and-search.component";
import { MyInfoModule } from "src/app/components/layouts/my-info/my-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileTestPageRoutingModule,
    MyInfoModule,
    PostModule,
    CatalogPageModule,
    SanitizeImagePipeModule,
    GetImageModule,
    ImageCropperModule,
    NgPipesModule,
    RightSideBarModule,
    ProductSearchModule,
    InnerCategoryListModule,
    ManufacturerInfoModule,
    ImageCropperPopoverPageModule,
  ],
  declarations: [
    ProfileTestPage,
    TabsAndSearchComponent,
    DesignerInfoPage,
    DesignerRatingComponent,
    DesignerPortfolioComponent,
    GetPortfolioImagePipe,
    BottomSubcatModalPage,
    BrowsePhotoComponent,
  ],

  providers: [NamePipe],
})
export class ProfileTestPageModule {}
