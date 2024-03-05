import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveBroadcastingPageRoutingModule } from './live-broadcasting-routing.module';

import { LiveBroadcastingPage } from './live-broadcasting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveBroadcastingPageRoutingModule
  ],
  declarations: [LiveBroadcastingPage]
})
export class LiveBroadcastingPageModule {}
