import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {PurchasePageRoutingModule} from "./purchase-routing.module";

import {PurchasePage} from "./purchase.page";
import {SanitizeImagePipeModule} from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import {GetImageModule} from "../../pipes/share-module/get-image/get-image.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PurchasePageRoutingModule,
        SanitizeImagePipeModule,
        GetImageModule,
    ],
  declarations: [PurchasePage],
})
export class PurchasePageModule {}
