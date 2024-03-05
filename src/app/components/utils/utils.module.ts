import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LongTextFieldComponent } from "./long-text-field/long-text-field.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CustomSelectComponent } from "./custom-select/custom-select.component";

@NgModule({
  declarations: [LongTextFieldComponent, CustomSelectComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [LongTextFieldComponent, CustomSelectComponent],
})
export class UtilsModule {}
