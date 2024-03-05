import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getGoodLength'
})
export class GetGoodLengthPipe implements PipeTransform {

  transform(good: any): number {
    if (Array.isArray(good))
      return good.length;
    return 0;
  }

}
