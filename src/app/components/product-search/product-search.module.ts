import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProductSearchComponent } from './product-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductSearchComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [ProductSearchComponent],
})
export class ProductSearchModule {}
