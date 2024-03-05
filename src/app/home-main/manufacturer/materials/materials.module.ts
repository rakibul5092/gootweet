import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MaterialsPageRoutingModule } from "./materials-routing.module";

import { MaterialsPage } from "./materials.page";
import { ApiInstructionsPageModule } from "./api-instructions/api-instructions.module";
import {GetImageModule} from "../../../pipes/share-module/get-image/get-image.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialsPageRoutingModule,
        ApiInstructionsPageModule,
        GetImageModule,
    ],
  declarations: [MaterialsPage],
})
export class MaterialsPageModule {}
