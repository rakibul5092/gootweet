import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VideoCallDashboardPage } from "./video-call-dashboard.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [VideoCallDashboardPage],
  exports: [VideoCallDashboardPage],
})
export class VideoCallDashboardPageModule {}
