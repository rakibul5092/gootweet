import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsMobileWebPageRoutingModule } from './notifications-mobile-web-routing.module';

import { NotificationsMobileWebPage } from './notifications-mobile-web.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsMobileWebPageRoutingModule
  ],
  declarations: [NotificationsMobileWebPage]
})
export class NotificationsMobileWebPageModule {}
