import {Pipe, PipeTransform} from '@angular/core';
import {material_image_base} from "../constants";

@Pipe({
  name: 'getMaterialImageForCartList'
})
export class GetMaterialImageForCartListPipe implements PipeTransform {

  transform(good: any): string {
    if (good)
      return good.images.includes("https://") || good.images.includes("http://") ? good.images : material_image_base + good.images;
    return "./../../assets/image_placeholder.webp";
  }

}
