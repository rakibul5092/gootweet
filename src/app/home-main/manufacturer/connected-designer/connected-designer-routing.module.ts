import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ConnectedDesignerPage} from './connected-designer.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectedDesignerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectedDesignerPageRoutingModule {}
