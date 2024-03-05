import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsWebPageRoutingModule } from './order-details-web-routing.module';

import { OrderDetailsWebPage } from './order-details-web.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsWebPageRoutingModule
  ],
  declarations: [OrderDetailsWebPage]
})
export class OrderDetailsWebPageModule {}
