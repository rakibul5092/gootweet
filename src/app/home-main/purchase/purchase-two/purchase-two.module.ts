import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {PurchaseTwoPageRoutingModule} from "./purchase-two-routing.module";

import {PurchaseTwoPage} from "./purchase-two.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseTwoPageRoutingModule
  ],
  declarations: [PurchaseTwoPage],
})
export class PurchaseTwoPageModule {}
