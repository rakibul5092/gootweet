import { Pipe, PipeTransform } from '@angular/core';
import {portfolio_image_base} from "../constants";

@Pipe({
  name: 'getPortfolioImage'
})
export class GetPortfolioImagePipe implements PipeTransform {

  transform(image: string): string {
    if (image)
      return portfolio_image_base + image;
    return "./../../assets/image_placeholder.webp";
  }

}
