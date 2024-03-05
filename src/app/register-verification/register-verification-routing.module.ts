import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterVerificationPage } from "./register-verification.page";

const routes: Routes = [
  {
    path: "",
    component: RegisterVerificationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterVerificationPageRoutingModule {}
