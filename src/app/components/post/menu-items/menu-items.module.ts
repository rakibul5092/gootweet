import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WallContextMenuPage } from "./wall-context-menu/wall-context-menu.page";
import { WallCommentMenuPage } from "./wall-comment-menu/wall-comment-menu.page";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [WallContextMenuPage, WallCommentMenuPage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class MenuItemsModule {}
