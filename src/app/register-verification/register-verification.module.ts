import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RegisterVerificationPageRoutingModule } from "./register-verification-routing.module";

import { RegisterVerificationPage } from "./register-verification.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterVerificationPageRoutingModule,
  ],
  declarations: [RegisterVerificationPage],
})
export class RegisterVerificationPageModule {}
