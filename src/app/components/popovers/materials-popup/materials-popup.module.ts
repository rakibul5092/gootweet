import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MaterialsPopupPage } from "./materials-popup.page";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, GetImageModule],
  declarations: [MaterialsPopupPage],
})
export class MaterialsPopupPageModule {}
