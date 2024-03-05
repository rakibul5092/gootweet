import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMobileMenuPage } from './user-mobile-menu.page';

const routes: Routes = [
  {
    path: '',
    component: UserMobileMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserMobileMenuPageRoutingModule {}
