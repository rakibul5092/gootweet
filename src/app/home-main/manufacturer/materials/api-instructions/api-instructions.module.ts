import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiInstructionsPageRoutingModule } from './api-instructions-routing.module';

import { ApiInstructionsPage } from './api-instructions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiInstructionsPageRoutingModule
  ],
  declarations: [ApiInstructionsPage]
})
export class ApiInstructionsPageModule {}
