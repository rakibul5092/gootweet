import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendDesignerMessengerPage } from './send-designer-messenger.page';

const routes: Routes = [
  {
    path: '',
    component: SendDesignerMessengerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendDesignerMessengerPageRoutingModule {}
