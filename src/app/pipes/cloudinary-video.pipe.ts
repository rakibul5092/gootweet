import { Pipe, PipeTransform } from "@angular/core";
import { Cloudinary, CloudinaryVideo } from "@cloudinary/url-gen";
import { quality } from "@cloudinary/url-gen/actions/delivery";

@Pipe({
  name: "cloudinary",
  pure: true,
})
export class CloudinaryVideoPipe implements PipeTransform {
  transform(publicId: string): any {
    return new Cloudinary({ cloud: { cloudName: "ddvayajgr" } })
      .video(publicId)
      .delivery(quality(30))
      .toURL();
  }
}
