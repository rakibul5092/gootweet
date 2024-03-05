import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {UserOrderPageRoutingModule} from "./user-order-routing.module";

import {UserOrderPage} from "./user-order.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserOrderPageRoutingModule
  ],
  declarations: [UserOrderPage],
})
export class UserOrderPageModule {}
