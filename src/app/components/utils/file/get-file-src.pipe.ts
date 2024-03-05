import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  LIVE_STREAMING_VIDEOS_BASE,
  WALLPOST_FILE_BASE,
} from "src/app/constants";

@Pipe({
  name: "getFileSrc",
})
export class GetFileSrcPipe implements PipeTransform {
  constructor(private dom: DomSanitizer) {}

  transform(file: any, wallId: string, isLiveVideo = false): any {
    if (file.dataForView) {
      const imageURL = this.dom.bypassSecurityTrustUrl(
        URL.createObjectURL(file.dataForView)
      );
      return imageURL;
    } else {
      return isLiveVideo
        ? LIVE_STREAMING_VIDEOS_BASE + file.url
        : WALLPOST_FILE_BASE + wallId + "/" + file.url;
    }
  }
}
