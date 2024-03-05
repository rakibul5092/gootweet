import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsMobileWebPage } from './notifications-mobile-web.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsMobileWebPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsMobileWebPageRoutingModule {}
