import { CommonModule } from "@angular/common";
import { NgModule, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SingleChatPageRoutingModule } from "./single-chat-routing.module";
import { SingleChatPage } from "./single-chat.page";
import { GetPricePipeModule } from "../../../pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SharedPipeModule } from "../../../pipes/shared-pipe/shared-pipe.module";
import { ChatInputModule } from "../../chat-components/chat-input/chat-input.module";
import { MessageContainerModule } from "../../chat-components/message-container/message-container.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChatPageRoutingModule,
    NgPipesModule,
    LazyLoadImageModule,
    SanitizeImagePipeModule,
    GetImageModule,
    GetPricePipeModule,
    SharedPipeModule,
    ChatInputModule,
    MessageContainerModule,
  ],
  declarations: [SingleChatPage],
  exports: [SingleChatPage],
})
export class SingleChatPageModule {}
