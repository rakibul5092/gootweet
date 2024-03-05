import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductInformationPage } from "./product-information.page";

const routes: Routes = [
  {
    path: "",
    component: ProductInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductInformationPageRoutingModule {}
