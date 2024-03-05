import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PurchasePage } from "./purchase.page";

const routes: Routes = [
  {
    path: "",
    component: PurchasePage,
  },
  {
    path: "information",
    loadChildren: () =>
      import("./purchase-two/purchase-two.module").then(
        (m) => m.PurchaseTwoPageModule
      ),
  },
  {
    path: "payment",
    loadChildren: () =>
      import("./purchase-three/purchase-three.module").then(
        (m) => m.PurchaseThreePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasePageRoutingModule {}
