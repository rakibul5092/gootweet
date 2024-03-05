import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputFieldComponent } from "./input-field.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [InputFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  exports: [InputFieldComponent],
})
export class InputFieldModule {}
