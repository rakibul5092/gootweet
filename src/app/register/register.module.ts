import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RegisterPageRoutingModule } from "./register-routing.module";

import { RegisterPage } from "./register.page";
import { UserRegisterModule } from "../components/user-register/user-register.module";
import { CloudinaryPlayerModule } from "../components/utils/cloudinary-player/cloudinary-player.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterPageRoutingModule,
    UserRegisterModule,
    CloudinaryPlayerModule,
  ],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
