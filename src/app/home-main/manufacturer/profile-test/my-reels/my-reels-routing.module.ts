import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyReelsPage } from './my-reels.page';

const routes: Routes = [
  {
    path: '',
    component: MyReelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyReelsPageRoutingModule {}
