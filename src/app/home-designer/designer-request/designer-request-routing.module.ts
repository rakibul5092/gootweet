import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerRequestPage } from './designer-request.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerRequestPageRoutingModule {}
