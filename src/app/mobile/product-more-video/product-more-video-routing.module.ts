import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductMoreVideoPage } from './product-more-video.page';

const routes: Routes = [
  {
    path: '',
    component: ProductMoreVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductMoreVideoPageRoutingModule {}
