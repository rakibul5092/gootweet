import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseTwoPage } from './purchase-two.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseTwoPageRoutingModule {}
