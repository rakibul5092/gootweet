import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesPopupPage } from './categories-popup.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesPopupPageRoutingModule {}
