import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ManufacturerPageRoutingModule } from "./manufacturer-routing.module";

import { ManufacturerPage } from "./manufacturer.page";
import { NgPipesModule } from "ngx-pipes";
import { SharedDirectiveModule } from "src/app/directives/shared-directive/shared-directive.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufacturerPageRoutingModule,
    NgPipesModule,
    SharedDirectiveModule,
  ],
  declarations: [ManufacturerPage],
})
export class ManufacturerPageModule {}
