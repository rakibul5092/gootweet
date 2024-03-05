import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminPage } from "./admin.page";

const routes: Routes = [
  {
    path: "",
    component: AdminPage,
    children: [
      {
        path: "admin-categories",
        loadChildren: () =>
          import("./categories/categories.module").then(
            (m) => m.CategoriesPageModule
          ),
      },

      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersPageModule),
      },
      {
        path: 'streamings',
        loadChildren: () => import('./streamings/streamings.module').then(m => m.StreamingsPageModule)
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
