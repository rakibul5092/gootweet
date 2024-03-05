import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CategoriesPage } from "./categories.page";

const routes: Routes = [
  {
    path: "",
    component: CategoriesPage,
    children: [
      {
        path: "categories-popup",
        loadChildren: () =>
          import("./categories-popup/categories-popup.module").then(
            (m) => m.CategoriesPopupPageModule
          ),
      },
    ],
  },  {
    path: 'edit-category',
    loadChildren: () => import('./edit-category/edit-category.module').then( m => m.EditCategoryPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesPageRoutingModule {}
