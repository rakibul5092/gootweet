import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterPage } from "./register.page";

const routes: Routes = [
  {
    path: "",
    component: RegisterPage,
  },
  {
    path: "terms-condition",
    loadChildren: () =>
      import("./terms-condition/terms-condition.module").then(
        (m) => m.TermsConditionPageModule
      ),
  },
  {
    path: "register-verified",
    loadChildren: () =>
      import("../register-verified/register-verified.module").then(
        (m) => m.RegisterVerifiedPageModule
      ),
  },
  {
    path: "register-verification",
    loadChildren: () =>
      import("../register-verification/register-verification.module").then(
        (m) => m.RegisterVerificationPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
