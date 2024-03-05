import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReelRecordPageRoutingModule } from './create-reel-record-routing.module';

import { CreateReelRecordPage } from './create-reel-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateReelRecordPageRoutingModule
  ],
  declarations: [CreateReelRecordPage]
})
export class CreateReelRecordPageModule {}
