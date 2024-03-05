import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CartPopoverPageRoutingModule } from "./cart-popover-routing.module";

import { CartPopoverPage } from "./cart-popover.page";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPopoverPageRoutingModule,
    GetImageModule,
  ],
  declarations: [CartPopoverPage],
})
export class CartPopoverPageModule {}
