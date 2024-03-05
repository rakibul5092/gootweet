import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiInstructionsPage } from './api-instructions.page';

const routes: Routes = [
  {
    path: '',
    component: ApiInstructionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiInstructionsPageRoutingModule {}
