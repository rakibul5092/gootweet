import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { MessageContainerModule } from "../chat/chat-components/message-container/message-container.module";
import { GetImageModule } from "../pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "../pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "../pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { CartPopoverPageModule } from "./cart-popover/cart-popover.module";
import { ChatNormalOutsidePageRoutingModule } from "./chat-normal-outside-routing.module";
import { ChatNormalOutsidePage } from "./chat-normal-outside.page";
import { SharedPipeModule } from "../pipes/shared-pipe/shared-pipe.module";
import { OptionPage } from "./option/option.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatNormalOutsidePageRoutingModule,
    NgPipesModule,
    SanitizeImagePipeModule,
    GetImageModule,
    GetPricePipeModule,
    LazyLoadImageModule,
    CartPopoverPageModule,
    MessageContainerModule,
    SharedPipeModule,
  ],
  declarations: [ChatNormalOutsidePage, OptionPage],
})
export class ChatNormalOutsidePageModule {}
