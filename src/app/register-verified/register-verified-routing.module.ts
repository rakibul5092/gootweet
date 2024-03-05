import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterVerifiedPage } from './register-verified.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterVerifiedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterVerifiedPageRoutingModule {}
