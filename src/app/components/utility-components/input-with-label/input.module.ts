import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputWithLabelComponent } from "./input-with-label.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedDirectiveModule } from "src/app/directives/shared-directive/shared-directive.module";

@NgModule({
  declarations: [InputWithLabelComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
  ],
  exports: [InputWithLabelComponent],
})
export class InputModule {}
