import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SendUserMessengerPageRoutingModule } from "./send-user-messenger-routing.module";

import { SendUserMessengerPage } from "./send-user-messenger.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendUserMessengerPageRoutingModule,
    SanitizeImagePipeModule,
  ],
  declarations: [SendUserMessengerPage],
})
export class SendUserMessengerPageModule {}
