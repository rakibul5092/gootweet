import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleLiveStreamPage } from './single-live-stream.page';

const routes: Routes = [
  {
    path: '',
    component: SingleLiveStreamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleLiveStreamPageRoutingModule {}
