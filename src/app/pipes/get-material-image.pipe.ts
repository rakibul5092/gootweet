import { Pipe, PipeTransform } from '@angular/core';
import {material_image_base} from "../constants";

@Pipe({
  name: 'getMaterialImage'
})
export class GetMaterialImagePipe implements PipeTransform {

  transform(main_image: string): string {
    if (main_image)
      return main_image.includes("https://") || main_image.includes("http://") ? main_image : material_image_base + main_image;
    return "./../../assets/image_placeholder.webp";
  }

}
