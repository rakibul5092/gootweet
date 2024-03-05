import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FurtherInformationPage } from './further-information.page';

const routes: Routes = [
  {
    path: '',
    component: FurtherInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FurtherInformationPageRoutingModule {}
