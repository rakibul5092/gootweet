import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopupFailedPageRoutingModule } from './topup-failed-routing.module';

import { TopupFailedPage } from './topup-failed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopupFailedPageRoutingModule
  ],
  declarations: [TopupFailedPage]
})
export class TopupFailedPageModule {}
