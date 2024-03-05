import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductReviewPageRoutingModule } from './product-review-routing.module';

import { ProductReviewPage } from './product-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductReviewPageRoutingModule
  ],
  declarations: [ProductReviewPage]
})
export class ProductReviewPageModule {}
