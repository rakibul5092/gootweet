import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterCategoryPage } from './register-category.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterCategoryPageRoutingModule {}
