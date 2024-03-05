import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoriesPageRoutingModule } from "./categories-routing.module";

import { CategoriesPage } from "./categories.page";
import { EditCategoryPageModule } from "./edit-category/edit-category.module";
import { CategoriesPopupPageModule } from "./categories-popup/categories-popup.module";
import { CatModalComponent } from "./cat-modal/cat-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    EditCategoryPageModule,
    CategoriesPopupPageModule,
  ],
  declarations: [CategoriesPage, CatModalComponent],
})
export class CategoriesPageModule {}
