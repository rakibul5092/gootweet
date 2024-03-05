import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductsPage } from "./products.page";

const routes: Routes = [
  {
    path: "",
    component: ProductsPage,
  },
  {
    path: "api-instructions",
    loadChildren: () =>
      import("./api-instructions/api-instructions.module").then(
        (m) => m.ApiInstructionsPageModule
      ),
    data: { name: "api-instructions" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
