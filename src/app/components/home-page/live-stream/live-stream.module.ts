import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LiveStreamComponent } from "./live-stream.component";
import { SanitizeVideoModule } from "src/app/pipes/share-module/sanitize-video.module";
import { HomeModule } from "../home.module";
@NgModule({
  declarations: [LiveStreamComponent],
  imports: [CommonModule, SanitizeVideoModule, HomeModule],
  exports: [LiveStreamComponent],
})
export class LiveStreamModule {}
