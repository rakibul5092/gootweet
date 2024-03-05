import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateReelRecordPage } from './create-reel-record.page';

const routes: Routes = [
  {
    path: '',
    component: CreateReelRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateReelRecordPageRoutingModule {}
