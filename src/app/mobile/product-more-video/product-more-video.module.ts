import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductMoreVideoPageRoutingModule } from "./product-more-video-routing.module";

import { ProductMoreVideoPage } from "./product-more-video.page";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";
import { MenuModule } from "src/app/components/menu-items/menu.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductMoreVideoPageRoutingModule,
    ProfilePhotoModule,
    MenuModule,
  ],
  declarations: [ProductMoreVideoPage],
})
export class ProductMoreVideoPageModule {}
