import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IncomingCallComponent } from "./incoming-call/incoming-call.component";
import { OutgoingCallComponent } from "./outgoing-call/outgoing-call.component";
import { IonicModule } from "@ionic/angular";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";

@NgModule({
  declarations: [IncomingCallComponent, OutgoingCallComponent],
  imports: [CommonModule, IonicModule, SanitizeImagePipeModule],
  exports: [IncomingCallComponent, OutgoingCallComponent],
})
export class CallModule {}
