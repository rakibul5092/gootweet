import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ManufacturerPage } from "./manufacturer.page";

const routes: Routes = [
  {
    path: "",
    component: ManufacturerPage,
    children: [
      // {
      //   path: "",
      //   loadChildren: () =>
      //     import("./profile/profile.module").then((m) => m.ProfilePageModule),
      //   data: { name: "profile" },
      // },
      {
        path: "",
        loadChildren: () =>
          import("./profile-test/profile-test.module").then((m) => m.ProfileTestPageModule),
        data: { name: "profile" },
      },
      {
        path: "products",
        loadChildren: () =>
          import("./products/products.module").then(
            (m) => m.ProductsPageModule
          ),
        data: { name: "products" },
      },
      {
        path: "materials",
        loadChildren: () =>
          import("./materials/materials.module").then(
            (m) => m.MaterialsPageModule
          ),
        data: { name: "materials" },
      },
      {
        path: "categories",
        loadChildren: () =>
          import("./categories/categories.module").then(
            (m) => m.CategoriesPageModule
          ),
        data: { name: "categories" },
      },
      {
        path: "manufacturer-order",
        loadChildren: () =>
          import("./manufacturer-order/manufacturer-order.module").then(
            (m) => m.ManufacturerOrderPageModule
          ),
        data: { name: "manufacturer-order" },
      },
      {
        path: "connected-designer",
        loadChildren: () =>
          import("./connected-designer/connected-designer.module").then(
            (m) => m.ConnectedDesignerPageModule
          ),
        data: { name: "connected-designer" },
      },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturerPageRoutingModule {}
