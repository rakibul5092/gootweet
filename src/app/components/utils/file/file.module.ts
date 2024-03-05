import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FileComponent } from "./file.component";
import { GetFileSrcPipe } from "./get-file-src.pipe";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
@NgModule({
  declarations: [FileComponent, GetFileSrcPipe],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImageModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  exports: [FileComponent],
})
export class FileModule {}
