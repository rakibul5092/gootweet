import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerProfileNewProjectPage } from './designer-profile-new-project.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerProfileNewProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerProfileNewProjectPageRoutingModule {}
