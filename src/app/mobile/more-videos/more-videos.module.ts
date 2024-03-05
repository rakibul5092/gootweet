import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreVideosPageRoutingModule } from './more-videos-routing.module';

import { MoreVideosPage } from './more-videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreVideosPageRoutingModule
  ],
  declarations: [MoreVideosPage]
})
export class MoreVideosPageModule {}
