import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PursePage } from './purse.page';

const routes: Routes = [
  {
    path: '',
    component: PursePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PursePageRoutingModule {}
