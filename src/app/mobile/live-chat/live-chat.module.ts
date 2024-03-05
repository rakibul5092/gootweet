import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LiveChatPageRoutingModule } from "./live-chat-routing.module";

import { VideoPlayerModule } from "src/app/components/utility-components/video-player/video-player.module";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { LiveChatPage } from "./live-chat.page";
import { MessageComponent } from "./message/message.component";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveChatPageRoutingModule,
    VideoPlayerModule,
    GetImageModule,
    SanitizeImagePipeModule,
    ProfilePhotoModule,
  ],
  declarations: [LiveChatPage, MessageComponent],
})
export class LiveChatPageModule {}
