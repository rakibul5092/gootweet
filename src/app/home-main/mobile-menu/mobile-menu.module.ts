import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobileMenuPageRoutingModule } from './mobile-menu-routing.module';

import { MobileMenuPage } from './mobile-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MobileMenuPageRoutingModule
  ],
  declarations: [MobileMenuPage]
})
export class MobileMenuPageModule {}
