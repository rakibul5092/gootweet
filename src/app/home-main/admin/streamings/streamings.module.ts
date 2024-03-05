import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StreamingsPageRoutingModule } from './streamings-routing.module';

import { StreamingsPage } from './streamings.page';
import { VideoModule } from 'src/app/components/video/video.module';
import { AddVideoComponent } from './add-video/add-video.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamingsPageRoutingModule,
    VideoModule
  ],
  declarations: [StreamingsPage, AddVideoComponent]
})
export class StreamingsPageModule { }
