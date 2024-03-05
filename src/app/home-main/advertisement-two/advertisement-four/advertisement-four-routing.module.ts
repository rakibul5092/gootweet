import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdvertisementFourPage } from "./advertisement-four.page";

const routes: Routes = [
  {
    path: "",
    component: AdvertisementFourPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertisementFourPageRoutingModule {}
