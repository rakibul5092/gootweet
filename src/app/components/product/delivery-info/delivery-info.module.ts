import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeliveryInfoComponent } from "./delivery-info.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [DeliveryInfoComponent],
  imports: [CommonModule, IonicModule],
  exports: [DeliveryInfoComponent],
})
export class DeliveryInfoModule {}
