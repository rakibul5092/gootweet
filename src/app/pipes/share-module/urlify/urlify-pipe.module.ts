import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Urlify } from "../../urlify.pipe";

@NgModule({
  declarations: [Urlify],
  imports: [CommonModule],
  exports: [Urlify],
})
export class UrlifyPipeModule {}
