import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingManufacturersPage } from './tracking-manufacturers.page';

const routes: Routes = [
  {
    path: '',
    component: TrackingManufacturersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingManufacturersPageRoutingModule {}
