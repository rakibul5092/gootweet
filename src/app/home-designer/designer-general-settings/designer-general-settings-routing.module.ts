import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerGeneralSettingsPage } from './designer-general-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerGeneralSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerGeneralSettingsPageRoutingModule {}
