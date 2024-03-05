import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerWalletPage } from './designer-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerWalletPageRoutingModule {}
