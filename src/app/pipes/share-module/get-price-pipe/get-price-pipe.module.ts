import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GetPricePipe } from "../../get-price.pipe";
import { GetUnitPipe } from "../../get-unit.pipe";

@NgModule({
  declarations: [GetPricePipe, GetUnitPipe],
  imports: [CommonModule],
  exports: [GetPricePipe, GetUnitPipe],
})
export class GetPricePipeModule {}
