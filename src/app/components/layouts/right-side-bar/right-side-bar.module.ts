import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { LiveStreamModule } from "../../home-page/live-stream/live-stream.module";
import { RightSideBarComponent } from "./right-side-bar.component";

@NgModule({
  declarations: [RightSideBarComponent],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    GetImageModule,
    SanitizeImagePipeModule,
    LiveStreamModule,
  ],
  exports: [RightSideBarComponent],
})
export class RightSideBarModule {}
