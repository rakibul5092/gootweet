import { Pipe, PipeTransform } from '@angular/core';
import {material_image_base} from "../constants";

@Pipe({
  name: 'getMImage'
})
export class GetMImagePipe implements PipeTransform {

  transform(subUrl: string): string {
    if (subUrl && subUrl.trim() !== "")
      return subUrl.includes("https://") || subUrl.includes("http://") ? subUrl : material_image_base + subUrl;
    return "./../../assets/blank.jpg";
  }

}
