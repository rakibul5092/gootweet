import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MaterialsCategoryPopoverPage } from "src/app/components/popovers/materials-category-popover/materials-category-popover.page";
import { MaterialsAddPageRoutingModule } from "./materials-add-routing.module";
import { MaterialsAddPage } from "./materials-add.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialsAddPageRoutingModule,
  ],
  declarations: [MaterialsAddPage, MaterialsCategoryPopoverPage],
})
export class MaterialsAddPageModule {}
