import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPricePipeModule } from 'src/app/pipes/share-module/get-price-pipe/get-price-pipe.module';
import { PriceComponent } from './price.component';

@NgModule({
  declarations: [PriceComponent],
  imports: [CommonModule, GetPricePipeModule],
  exports: [PriceComponent],
})
export class PriceModule {}
