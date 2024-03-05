import { NgModule } from "@angular/core";
import { SanitizeVideoPipe } from "../sanitize-video.pipe";

@NgModule({
    declarations: [
        SanitizeVideoPipe
    ],
    imports: [],
    exports: [
        SanitizeVideoPipe
    ],
})
export class SanitizeVideoModule { }
