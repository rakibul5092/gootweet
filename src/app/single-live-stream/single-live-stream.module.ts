import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleLiveStreamPageRoutingModule } from './single-live-stream-routing.module';

import { SingleLiveStreamPage } from './single-live-stream.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleLiveStreamPageRoutingModule
  ],
  declarations: [SingleLiveStreamPage]
})
export class SingleLiveStreamPageModule {}
