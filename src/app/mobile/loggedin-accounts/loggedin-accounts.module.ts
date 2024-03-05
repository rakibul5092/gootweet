import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoggedinAccountsPageRoutingModule } from './loggedin-accounts-routing.module';

import { LoggedinAccountsPage } from './loggedin-accounts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoggedinAccountsPageRoutingModule
  ],
  declarations: [LoggedinAccountsPage]
})
export class LoggedinAccountsPageModule {}
