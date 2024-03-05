import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRegisterComponent } from "./user-register.component";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [UserRegisterComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  exports: [UserRegisterComponent],
})
export class UserRegisterModule {}
