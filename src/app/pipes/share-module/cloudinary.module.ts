import { NgModule } from "@angular/core";
import { CloudinaryVideoPipe } from "../cloudinary-video.pipe";
import { CloudinaryThumbPipe } from "../cloudinary-thumb.pipe";

@NgModule({
  declarations: [CloudinaryVideoPipe, CloudinaryThumbPipe],
  imports: [],
  exports: [CloudinaryVideoPipe, CloudinaryThumbPipe],
})
export class CloudinaryPipeModule {}
