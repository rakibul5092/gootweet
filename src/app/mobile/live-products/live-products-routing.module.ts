import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveProductsPage } from './live-products.page';

const routes: Routes = [
  {
    path: '',
    component: LiveProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveProductsPageRoutingModule {}
