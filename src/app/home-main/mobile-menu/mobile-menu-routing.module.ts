import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileMenuPage } from './mobile-menu.page';

const routes: Routes = [
  {
    path: '',
    component: MobileMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileMenuPageRoutingModule {}
