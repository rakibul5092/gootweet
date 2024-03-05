import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ConnectedDesignerPageRoutingModule } from "./connected-designer-routing.module";

import { ConnectedDesignerPage } from "./connected-designer.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { DesignerOptionModule } from "src/app/components/designer-vip-option/options.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectedDesignerPageRoutingModule,
    SanitizeImagePipeModule,
    DesignerOptionModule,
  ],
  declarations: [ConnectedDesignerPage],
})
export class ConnectedDesignerPageModule {}
