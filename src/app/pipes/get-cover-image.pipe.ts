import { Pipe, PipeTransform } from "@angular/core";
import { cover_image } from "../constants";

@Pipe({
  name: "getCoverImage",
})
export class GetCoverImagePipe implements PipeTransform {
  transform(image: string): string {
    if (image && image != "") return cover_image + image;
    return "assets/img/bg-login.png";
  }
}
