import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreVideosPage } from './more-videos.page';

const routes: Routes = [
  {
    path: '',
    component: MoreVideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreVideosPageRoutingModule {}
