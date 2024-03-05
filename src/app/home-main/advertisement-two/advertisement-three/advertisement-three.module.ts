import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AdvertisementThreePageRoutingModule } from "./advertisement-three-routing.module";

import { AdvertisementThreePage } from "./advertisement-three.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvertisementThreePageRoutingModule,
  ],
  declarations: [AdvertisementThreePage],
})
export class AdvertisementThreePageModule {}
