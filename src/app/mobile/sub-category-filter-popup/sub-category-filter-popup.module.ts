import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubCategoryFilterPopupPageRoutingModule } from './sub-category-filter-popup-routing.module';

import { SubCategoryFilterPopupPage } from './sub-category-filter-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubCategoryFilterPopupPageRoutingModule
  ],
  declarations: [SubCategoryFilterPopupPage]
})
export class SubCategoryFilterPopupPageModule {}
