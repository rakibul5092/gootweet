import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { ResetPasswordPopupPage } from "../components/popovers/reset-password-popup/reset-password-popup.page";
import { CloudinaryPlayerModule } from "../components/utils/cloudinary-player/cloudinary-player.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    CloudinaryPlayerModule,
  ],
  declarations: [LoginPage, ResetPasswordPopupPage],
})
export class LoginPageModule {}
