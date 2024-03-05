import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";
import { CloudinaryPipeModule } from "src/app/pipes/share-module/cloudinary.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SanitizeVideoModule } from "src/app/pipes/share-module/sanitize-video.module";
import { VideoElementComponent } from "./video-element.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SanitizeVideoModule,
    ProfilePhotoModule,
    SanitizeImagePipeModule,
    CloudinaryPipeModule,
  ],
  declarations: [VideoElementComponent],
  exports: [VideoElementComponent],
})
export class VideoElementModule {}
