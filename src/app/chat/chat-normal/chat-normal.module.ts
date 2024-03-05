import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ChatNormalPageRoutingModule } from "./chat-normal-routing.module";
import { ChatNormalPage } from "./chat-normal.page";
import { UserConversationsModule } from "./user-conversations/user-conversations.module";

@NgModule({
  imports: [IonicModule, ChatNormalPageRoutingModule, UserConversationsModule],
  exports: [ChatNormalPage],
  declarations: [ChatNormalPage],
})
export class ChatNormalPageModule {}
