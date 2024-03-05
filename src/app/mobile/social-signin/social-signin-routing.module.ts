import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialSigninPage } from './social-signin.page';

const routes: Routes = [
  {
    path: '',
    component: SocialSigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialSigninPageRoutingModule {}
