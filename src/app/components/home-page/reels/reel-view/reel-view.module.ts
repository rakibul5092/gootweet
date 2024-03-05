import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CloudinaryModule } from "@cloudinary/ng";
import { IonicModule } from "@ionic/angular";
import { VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { ProfilePhotoModule } from "src/app/components/utils/profile-photo/profile-photo.module";
import { IsLiked } from "src/app/pipes/is-liked/is-liked.pipe";
import { CloudinaryPipeModule } from "src/app/pipes/share-module/cloudinary.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SwiperModule } from "swiper/angular";
import { CommentComponent } from "./comments/comment/comment.component";
import { CommentsComponent } from "./comments/comments.component";
import { ReelViewRoutingModule } from "./reel-view-routing.module";
import { ReelViewComponent } from "./reel-view.component";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";

@NgModule({
  declarations: [
    ReelViewComponent,
    CommentsComponent,
    CommentComponent,
    IsLiked,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReelViewRoutingModule,
    ProfilePhotoModule,
    SwiperModule,
    FormsModule,
    SanitizeImagePipeModule,
    CloudinaryModule,
    CloudinaryPipeModule,
    VgCoreModule,
    VgOverlayPlayModule,
    VgControlsModule,
    VgBufferingModule,
  ],
  exports: [ReelViewComponent],
})
export class ReelViewModule {}
