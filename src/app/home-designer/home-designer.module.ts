import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeDesignerPageRoutingModule } from './home-designer-routing.module';

import { HomeDesignerPage } from './home-designer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeDesignerPageRoutingModule
  ],
  declarations: [HomeDesignerPage]
})
export class HomeDesignerPageModule {}
