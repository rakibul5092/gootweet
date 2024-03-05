import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DesignerRequestPageRoutingModule } from "./designer-request-routing.module";

import { DesignerRequestPage } from "./designer-request.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { DesignerOptionModule } from "src/app/components/designer-vip-option/options.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerRequestPageRoutingModule,
    SanitizeImagePipeModule,
    DesignerOptionModule,
  ],
  declarations: [DesignerRequestPage],
})
export class DesignerRequestPageModule {}
