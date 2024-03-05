import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FurtherInformationPageRoutingModule } from './further-information-routing.module';

import { FurtherInformationPage } from './further-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FurtherInformationPageRoutingModule
  ],
  declarations: [FurtherInformationPage]
})
export class FurtherInformationPageModule {}
