import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HideHeaderDirective } from "../hide-header.directive";
import { InvalidDirective } from "../invalid.directive";

@NgModule({
  declarations: [HideHeaderDirective, InvalidDirective],
  imports: [CommonModule],
  exports: [HideHeaderDirective, InvalidDirective],
})
export class SharedDirectiveModule {}
