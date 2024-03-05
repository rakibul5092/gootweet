import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfileTestPage } from "./profile-test.page";

const routes: Routes = [
  {
    path: ":name/:uid",
    component: ProfileTestPage,
    children: [
      {
        path: "catalog",
        loadChildren: () =>
          import("./catalog/catalog.module").then((m) => m.CatalogPageModule),
        data: { name: "catalog" },
      },
      {
        path: "reels",
        loadChildren: () =>
          import("./my-reels/my-reels.module").then((m) => m.MyReelsPageModule),
      },
      {
        path: "lives",
        loadChildren: () =>
          import("./my-lives/my-lives.module").then((m) => m.MyLivesPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileTestPageRoutingModule {}
