import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StreamingsPage } from './streamings.page';

const routes: Routes = [
  {
    path: '',
    component: StreamingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreamingsPageRoutingModule {}
