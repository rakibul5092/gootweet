import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurseReplenishmentPage } from './purse-replenishment.page';

const routes: Routes = [
  {
    path: '',
    component: PurseReplenishmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurseReplenishmentPageRoutingModule {}
