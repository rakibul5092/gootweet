import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManufacturerComponent } from "src/app/components/manufacturer/manufacturer.component";

import { DesignerMyManufacturerCatalogOnePage } from "./designer-my-manufacturer-catalog-one.page";

const routes: Routes = [
  {
    path: "",
    component: DesignerMyManufacturerCatalogOnePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerMyManufacturerCatalogOnePageRoutingModule {}
