import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendUserMessengerPage } from './send-user-messenger.page';

const routes: Routes = [
  {
    path: '',
    component: SendUserMessengerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendUserMessengerPageRoutingModule {}
