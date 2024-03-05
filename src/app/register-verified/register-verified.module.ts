import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RegisterVerifiedPageRoutingModule } from './register-verified-routing.module';

import { RegisterVerifiedPage } from './register-verified.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterVerifiedPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterVerifiedPage]
})
export class RegisterVerifiedPageModule {}
