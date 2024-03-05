import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MaterialsAddPage } from "./materials-add.page";

const routes: Routes = [
  {
    path: "",
    component: MaterialsAddPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsAddPageRoutingModule {}
