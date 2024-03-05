import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCategoryPageRoutingModule } from './register-category-routing.module';

import { RegisterCategoryPage } from './register-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterCategoryPageRoutingModule
  ],
  declarations: [RegisterCategoryPage]
})
export class RegisterCategoryPageModule {}
