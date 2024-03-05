import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ImageUploadComponent } from "./image-upload.component";

@NgModule({
  declarations: [ImageUploadComponent],
  imports: [CommonModule],
  exports: [ImageUploadComponent],
})
export class ImageUploadModule {}
