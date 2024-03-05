import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveBroadcastingPage } from './live-broadcasting.page';

const routes: Routes = [
  {
    path: '',
    component: LiveBroadcastingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveBroadcastingPageRoutingModule {}
