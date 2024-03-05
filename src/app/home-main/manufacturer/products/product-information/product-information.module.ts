import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductInformationPageRoutingModule } from "./product-information-routing.module";

import { CreateProductModule } from "src/app/components/create-product/create-product.module";
import { UtilsModule } from "src/app/components/utils/utils.module";
import { ProductInformationPage } from "./product-information.page";
// import { AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductInformationPageRoutingModule,
    ReactiveFormsModule,
    UtilsModule,
    CreateProductModule,
    // AngularEditorModule,
  ],
  declarations: [ProductInformationPage],
})
export class ProductInformationPageModule {}
