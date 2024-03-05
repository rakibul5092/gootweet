import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GootweetTubePage } from './gootweet-tube.page';

const routes: Routes = [
  {
    path: '',
    component: GootweetTubePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GootweetTubePageRoutingModule {}
