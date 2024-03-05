import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductFilterPage } from './product-filter.page';
import { MobileCategoryPage } from './mobile-category/mobile-category.page';
import { SubCategoryPage } from './sub-category/sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: ProductFilterPage,
    children: [
      {
        path: 'mobile-category',
        component: MobileCategoryPage
      },
      {
        path: 'search/:id/:text',
        component: SubCategoryPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductFilterPageRoutingModule { }
