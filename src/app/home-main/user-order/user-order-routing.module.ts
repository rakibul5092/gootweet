import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserOrderPage } from './user-order.page';

const routes: Routes = [
  {
    path: '',
    component: UserOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOrderPageRoutingModule {}
