import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorsComponent } from "./colors/colors.component";
import { SizesComponent } from "./sizes/sizes.component";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ColorPopoverPage } from "src/app/home-main/manufacturer/products/product-information/color-popover/color-popover.page";

@NgModule({
  declarations: [ColorsComponent, SizesComponent, ColorPopoverPage],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [ColorsComponent, SizesComponent],
})
export class CreateProductModule {}
