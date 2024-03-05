import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartPopoverPage } from './cart-popover.page';

const routes: Routes = [
  {
    path: '',
    component: CartPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartPopoverPageRoutingModule {}
