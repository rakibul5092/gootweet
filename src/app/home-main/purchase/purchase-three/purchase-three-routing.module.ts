import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseThreePage } from './purchase-three.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseThreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseThreePageRoutingModule {}
