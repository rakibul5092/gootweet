import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerSendingRequestPage } from './designer-sending-request.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerSendingRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerSendingRequestPageRoutingModule {}
