import { Pipe, PipeTransform } from "@angular/core";
import { image_base } from "../constants";

@Pipe({
  name: "sanitizeImage",
  pure: true,
})
export class SanitizeImagePipe implements PipeTransform {
  transform(url: string, size?: string): string {
    if (url && url !== "") {
      if (url.includes("https://")) {
        return url;
      } else {
        // return image_base + url;
        return image_base + url;
      }
    } else {
      return "assets/profile.jpg";
    }
  }
}
