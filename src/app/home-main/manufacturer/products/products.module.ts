import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { NgPipesModule } from 'ngx-pipes';
import { GetPricePipeModule } from 'src/app/pipes/share-module/get-price-pipe/get-price-pipe.module';
import { GetImageModule } from 'src/app/pipes/share-module/get-image/get-image.module';
import { ApiInstructionsPageModule } from './api-instructions/api-instructions.module';
import { GetStockPipe } from '../../../pipes/get-stock.pipe';
import { ProductComponent } from './product/product.component';
import { MaterialsPopupPageModule } from 'src/app/components/popovers/materials-popup/materials-popup.module';
import { CategoryFilterPage } from 'src/app/components/popovers/category-filter/category-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    NgPipesModule,
    GetPricePipeModule,
    GetImageModule,
    ApiInstructionsPageModule,
    MaterialsPopupPageModule,
  ],
  declarations: [
    ProductsPage,
    GetStockPipe,
    ProductComponent,
    CategoryFilterPage,
  ],
})
export class ProductsPageModule {}
