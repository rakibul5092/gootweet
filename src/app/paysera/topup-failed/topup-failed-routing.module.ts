import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopupFailedPage } from './topup-failed.page';

const routes: Routes = [
  {
    path: '',
    component: TopupFailedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopupFailedPageRoutingModule {}
