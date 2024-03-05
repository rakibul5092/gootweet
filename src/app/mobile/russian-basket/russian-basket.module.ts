import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RussianBasketPageRoutingModule } from './russian-basket-routing.module';

import { RussianBasketPage } from './russian-basket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RussianBasketPageRoutingModule
  ],
  declarations: [RussianBasketPage]
})
export class RussianBasketPageModule {}
