import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgPipesModule } from 'ngx-pipes';
import { ProductModule } from 'src/app/components/product/product.module';
import { GetImageModule } from 'src/app/pipes/share-module/get-image/get-image.module';
import { GetPricePipeModule } from 'src/app/pipes/share-module/get-price-pipe/get-price-pipe.module';
import { CatalogPageRoutingModule } from './catalog-routing.module';
import { CatalogPage } from './catalog.page';
import { ProductSearchModule } from 'src/app/components/product-search/product-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogPageRoutingModule,
    LazyLoadImageModule,
    GetPricePipeModule,
    GetImageModule,
    NgPipesModule,
    ProductModule,
    ProductSearchModule,
    IonicModule,
  ],
  declarations: [CatalogPage],
})
export class CatalogPageModule { }
