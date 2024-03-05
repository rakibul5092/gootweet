import { Pipe, PipeTransform } from "@angular/core";
import { product_image_base } from "../constants";

@Pipe({
  name: "getImage",
  pure: true,
})
export class GetImagePipe implements PipeTransform {
  transform(main_images: any, search = false, index = 0): string {
    if (main_images && main_images.length > 0) {
      if (search) {
        return main_images.includes("https://") ||
          main_images.includes("http://")
          ? main_images
          : product_image_base + main_images;
      }
      return main_images[index].includes("https://") ||
        main_images[index].includes("http://")
        ? main_images[index]
        : product_image_base + main_images[index];
    } else {
      return "./../../assets/image_placeholder.webp";
    }
  }
}
