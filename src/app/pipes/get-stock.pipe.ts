import { Pipe, PipeTransform } from '@angular/core';
import {NormalGood, VariationGood} from "../models/product";

@Pipe({
  name: 'getStock'
})
export class GetStockPipe implements PipeTransform {

  transform(good: VariationGood | NormalGood): any {
    if (Array.isArray(good))
      return good[0].inStock;
    return good.inStock;
  }

}
