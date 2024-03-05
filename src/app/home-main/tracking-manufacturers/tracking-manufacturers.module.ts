import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TrackingManufacturersPageRoutingModule } from "./tracking-manufacturers-routing.module";

import { TrackingManufacturersPage } from "./tracking-manufacturers.page";
import { NgPipesModule } from "ngx-pipes";
import { PostModule } from "../../components/post/post.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { MyInfoModule } from "src/app/components/layouts/my-info/my-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackingManufacturersPageRoutingModule,
    NgPipesModule,
    MyInfoModule,
    PostModule,
    SanitizeImagePipeModule,
  ],
  declarations: [TrackingManufacturersPage],
})
export class TrackingManufacturersPageModule {}
