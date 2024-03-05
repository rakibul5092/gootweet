import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserOrderProductsPage } from './user-order-products.page';

const routes: Routes = [
  {
    path: '',
    component: UserOrderProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOrderProductsPageRoutingModule {}
