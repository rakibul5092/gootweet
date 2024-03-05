import { Pipe, PipeTransform } from "@angular/core";
import { wall_post_image_base } from "../constants";

@Pipe({
  name: "getWallPostCoverImage",
})
export class GetWallPostCoverImagePipe implements PipeTransform {
  transform(image: string): string {
    if (image && image != "") return wall_post_image_base + image;
    return "./../../assets/img/bg-login.png";
  }
}
