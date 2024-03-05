import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SanitizeImagePipe } from "../../sanitize-image.pipe";
import { GetCoverImagePipe } from "../../get-cover-image.pipe";
import { NamePipe } from "../../name.pipe";
import { StatusPipe } from "../../status.pipe";

@NgModule({
  declarations: [SanitizeImagePipe, GetCoverImagePipe, NamePipe, StatusPipe],
  imports: [CommonModule],
  exports: [SanitizeImagePipe, GetCoverImagePipe, NamePipe, StatusPipe],
})
export class SanitizeImagePipeModule {}
