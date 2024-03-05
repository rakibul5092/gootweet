import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertisementThreePage } from './advertisement-three.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertisementThreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertisementThreePageRoutingModule {}
