import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllLiveStreamPage } from './all-live-stream.page';

const routes: Routes = [
  {
    path: '',
    component: AllLiveStreamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllLiveStreamPageRoutingModule {}
