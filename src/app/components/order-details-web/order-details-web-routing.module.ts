import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDetailsWebPage } from './order-details-web.page';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsWebPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDetailsWebPageRoutingModule {}
