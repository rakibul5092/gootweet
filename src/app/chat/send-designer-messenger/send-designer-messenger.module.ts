import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SendDesignerMessengerPageRoutingModule } from "./send-designer-messenger-routing.module";

import { SendDesignerMessengerPage } from "./send-designer-messenger.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendDesignerMessengerPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [SendDesignerMessengerPage],
})
export class SendDesignerMessengerPageModule {}
