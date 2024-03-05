import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: "sanitizeVideo",
    pure: true,
})
export class SanitizeVideoPipe implements PipeTransform {
    constructor(private san: DomSanitizer) { }
    transform(url: string, autoplay: boolean, width: string, height: number, isRightSide = false): any {

        return this.san.bypassSecurityTrustResourceUrl(url + '&autoplay=' + autoplay + '&height=' + height + '&width=' + width)
    }
}
