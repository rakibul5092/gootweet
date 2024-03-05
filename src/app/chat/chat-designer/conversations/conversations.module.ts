import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConversationsComponent } from "./conversations.component";
import { IonicModule } from "@ionic/angular";
import { NgPipesModule } from "ngx-pipes";
import { ChatInputModule } from "../../chat-components/chat-input/chat-input.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "src/app/pipes/share-module/get-price-pipe/get-price-pipe.module";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { MessageContainerModule } from "../../chat-components/message-container/message-container.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SharedPipeModule } from "src/app/pipes/shared-pipe/shared-pipe.module";
import { ShareProductModule } from "../../chat-components/share-product/share-product.module";
import { RequestComponent } from "../request/request.component";

@NgModule({
  declarations: [ConversationsComponent, RequestComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgPipesModule,
    SharedPipeModule,
    SanitizeImagePipeModule,
    LazyLoadImageModule,
    GetImageModule,
    GetPricePipeModule,
    MessageContainerModule,
    ShareProductModule,
    ChatInputModule,
  ],
  exports: [ConversationsComponent],
})
export class ConversationsModule {}
