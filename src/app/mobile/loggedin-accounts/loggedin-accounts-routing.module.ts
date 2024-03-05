import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedinAccountsPage } from './loggedin-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: LoggedinAccountsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedinAccountsPageRoutingModule {}
