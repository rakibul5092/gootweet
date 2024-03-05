import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserConversationsComponent } from "./user-conversations.component";
import { IonicModule } from "@ionic/angular";
import { NgPipesModule } from "ngx-pipes";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { MessageContainerModule } from "../../chat-components/message-container/message-container.module";
import { ShareProductModule } from "../../chat-components/share-product/share-product.module";
import { ChatInputModule } from "../../chat-components/chat-input/chat-input.module";
import { FormsModule } from "@angular/forms";
import { VideoCallDashboardPageModule } from "src/app/home-designer/video-call-dashboard/video-call-dashboard.module";

@NgModule({
  declarations: [UserConversationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    SanitizeImagePipeModule,
    GetImageModule,
    GetPricePipeModule,
    MessageContainerModule,
    ShareProductModule,
    ChatInputModule,
    VideoCallDashboardPageModule,
  ],
  exports: [UserConversationsComponent],
})
export class UserConversationsModule {}
