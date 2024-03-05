import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CategoriesPopupPageRoutingModule} from './categories-popup-routing.module';
import {CategoriesPopupPage} from './categories-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPopupPageRoutingModule
  ],
  declarations: [CategoriesPopupPage]
})
export class CategoriesPopupPageModule {}
