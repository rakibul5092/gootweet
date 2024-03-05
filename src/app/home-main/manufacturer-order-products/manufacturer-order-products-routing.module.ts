import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufacturerOrderProductsPage } from './manufacturer-order-products.page';

const routes: Routes = [
  {
    path: '',
    component: ManufacturerOrderProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerOrderProductsPageRoutingModule {}
