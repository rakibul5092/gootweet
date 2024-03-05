import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";

import { AppModule } from "./app.module";
import { AppComponent } from "./app.component";
import { IonicServerModule } from "@ionic/angular-server";
@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    IonicServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
