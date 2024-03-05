import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonsComponent } from "./buttons/buttons.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [ButtonsComponent],
  imports: [CommonModule, IonicModule],
  exports: [ButtonsComponent],
})
export class MakePostModule {}
