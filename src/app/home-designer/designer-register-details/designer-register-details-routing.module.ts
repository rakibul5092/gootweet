import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerRegisterDetailsPage } from './designer-register-details.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerRegisterDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerRegisterDetailsPageRoutingModule {}
