import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductFilterPageRoutingModule } from './product-filter-routing.module';

import { ProductFilterPage } from './product-filter.page';
import { ProductModule } from 'src/app/components/product/product.module';
import { ProductSearchModule } from 'src/app/components/product-search/product-search.module';
import { NgAisModule } from 'angular-instantsearch';
import { SubCategoryPage } from './sub-category/sub-category.page';
import { MobileCategoryPage } from './mobile-category/mobile-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductFilterPageRoutingModule,
    ProductModule,
    ProductSearchModule,
    NgAisModule
  ],
  declarations: [ProductFilterPage, SubCategoryPage, MobileCategoryPage]
})
export class ProductFilterPageModule { }
