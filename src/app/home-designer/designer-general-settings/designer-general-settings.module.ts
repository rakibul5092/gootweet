import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DesignerGeneralSettingsPageRoutingModule } from "./designer-general-settings-routing.module";

import { DesignerGeneralSettingsPage } from "./designer-general-settings.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerGeneralSettingsPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [DesignerGeneralSettingsPage],
})
export class DesignerGeneralSettingsPageModule {}
