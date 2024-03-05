import { Pipe, PipeTransform } from "@angular/core";
import { Cloudinary } from "@cloudinary/url-gen";

@Pipe({
  name: "cloudinaryThumb",
  pure: true,
})
export class CloudinaryThumbPipe implements PipeTransform {
  transform(publicId: string, type: string = "video"): any {
    const cl = new Cloudinary({ cloud: { cloudName: "ddvayajgr" } }); // Replace 'your_cloud_name' with your actual Cloudinary cloud name
    return cl.image(publicId).quality(60).setAssetType(type).toURL();
  }
}
