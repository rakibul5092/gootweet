import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReelCardComponent } from "./reel-card.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [ReelCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [ReelCardComponent],
})
export class ReelCardModule {}
