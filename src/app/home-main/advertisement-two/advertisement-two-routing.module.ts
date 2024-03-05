import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdvertisementTwoPage } from "./advertisement-two.page";

const routes: Routes = [
  {
    path: "",
    component: AdvertisementTwoPage,
  },

  {
    path: "advertisement-three",
    loadChildren: () =>
      import("./advertisement-three/advertisement-three.module").then(
        (m) => m.AdvertisementThreePageModule
      ),
  },

  {
    path: "advertisement-four",
    loadChildren: () =>
      import("./advertisement-four/advertisement-four.module").then(
        (m) => m.AdvertisementFourPageModule
      ),
    data: { name: "advertisement-four" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertisementTwoPageRoutingModule {}
