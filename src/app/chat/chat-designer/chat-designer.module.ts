import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DesignerCartListPopupPage } from "src/app/components/popovers/designer-cart-list-popup/designer-cart-list-popup.page";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { ChatDesignerPageRoutingModule } from "./chat-designer-routing.module";
import { ChatDesignerPage } from "./chat-designer.page";
import { ConversationsModule } from "./conversations/conversations.module";

@NgModule({
  imports: [
    IonicModule,
    ChatDesignerPageRoutingModule,
    ConversationsModule,
    GetImageModule,
  ],
  declarations: [ChatDesignerPage, DesignerCartListPopupPage],
})
export class ChatDesignerPageModule {}
