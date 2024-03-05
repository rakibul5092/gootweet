import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllLiveStreamPageRoutingModule } from './all-live-stream-routing.module';

import { AllLiveStreamPage } from './all-live-stream.page';
import { VideoModule } from '../components/video/video.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllLiveStreamPageRoutingModule,
    VideoModule
  ],
  declarations: [AllLiveStreamPage]
})
export class AllLiveStreamPageModule { }
