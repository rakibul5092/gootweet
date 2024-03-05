import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GetFileSrcPipe } from "../../utils/file/get-file-src.pipe";
import { IonicModule } from "@ionic/angular";
import { FileContainerComponent } from "./file-container.component";
import { FileModule } from "../../utils/file/file.module";

@NgModule({
  declarations: [FileContainerComponent],
  imports: [CommonModule, IonicModule, FileModule],
  exports: [FileContainerComponent],
})
export class FileContainerModule {}
