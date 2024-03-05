import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {ManufacturerOrderPageRoutingModule} from "./manufacturer-order-routing.module";

import {ManufacturerOrderPage} from "./manufacturer-order.page";
import {NgPipesModule} from "ngx-pipes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerOrderPageRoutingModule,
    NgPipesModule,
  ],
  declarations: [ManufacturerOrderPage],
})
export class ManufacturerOrderPageModule {}
