import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewLivePage } from './view-live.page';

const routes: Routes = [
  {
    path: '',
    component: ViewLivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewLivePageRoutingModule {}
