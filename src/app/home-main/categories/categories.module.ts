import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoriesPageRoutingModule } from "./categories-routing.module";

import { CategoriesPage } from "./categories.page";
import { CategoryComponent } from "src/app/components/home-page/category/category.component";
import { SubCategoryComponent } from "src/app/components/home-page/sub-category/sub-category.component";
import { ProductModule } from "src/app/components/product/product.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    ProductModule,
  ],
  declarations: [CategoriesPage, CategoryComponent, SubCategoryComponent],
})
export class CategoriesPageModule {}
