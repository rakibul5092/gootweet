import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubCategoryFilterPopupPage } from './sub-category-filter-popup.page';

const routes: Routes = [
  {
    path: '',
    component: SubCategoryFilterPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubCategoryFilterPopupPageRoutingModule {}
