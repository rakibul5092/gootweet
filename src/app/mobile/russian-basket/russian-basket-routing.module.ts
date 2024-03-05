import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RussianBasketPage } from './russian-basket.page';

const routes: Routes = [
  {
    path: '',
    component: RussianBasketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RussianBasketPageRoutingModule {}
