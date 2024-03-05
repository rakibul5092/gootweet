import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BottomNavComponent } from "./bottom-nav.component";
import { IonicModule } from "@ionic/angular";
import { MenuModule } from "../../menu-items/menu.module";

@NgModule({
  declarations: [BottomNavComponent],
  imports: [CommonModule, IonicModule, MenuModule],
  exports: [BottomNavComponent],
})
export class BottomNavModule {}
