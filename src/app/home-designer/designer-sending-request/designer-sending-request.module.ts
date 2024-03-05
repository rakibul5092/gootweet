import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {DesignerSendingRequestPageRoutingModule} from "./designer-sending-request-routing.module";

import {DesignerSendingRequestPage} from "./designer-sending-request.page";
import {SanitizeImagePipeModule} from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerSendingRequestPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [DesignerSendingRequestPage],
})
export class DesignerSendingRequestPageModule {}
