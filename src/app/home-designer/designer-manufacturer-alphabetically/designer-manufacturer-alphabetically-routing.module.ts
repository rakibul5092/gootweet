import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerManufacturerAlphabeticallyPage } from './designer-manufacturer-alphabetically.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerManufacturerAlphabeticallyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerManufacturerAlphabeticallyPageRoutingModule {}
