import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialSigninPageRoutingModule } from './social-signin-routing.module';

import { SocialSigninPage } from './social-signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialSigninPageRoutingModule
  ],
  declarations: [SocialSigninPage]
})
export class SocialSigninPageModule {}
