import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ImageCropperModule } from "ngx-image-cropper";
import { ImageCropperPopoverPage } from "./image-cropper-popover.page";
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ImageCropperModule],
  declarations: [ImageCropperPopoverPage],
  exports: [ImageCropperPopoverPage],
})
export class ImageCropperPopoverPageModule {}
