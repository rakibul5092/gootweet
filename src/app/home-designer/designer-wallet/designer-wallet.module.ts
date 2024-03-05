import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DesignerWalletPageRoutingModule } from "./designer-wallet-routing.module";

import { DesignerWalletPage } from "./designer-wallet.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerWalletPageRoutingModule,
    SanitizeImagePipeModule,
    GetImageModule,
  ],
  declarations: [DesignerWalletPage],
})
export class DesignerWalletPageModule {}
