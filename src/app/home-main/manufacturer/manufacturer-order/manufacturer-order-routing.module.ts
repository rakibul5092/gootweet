import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerOrderPage } from './manufacturer-order.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerOrderPageRoutingModule {}
