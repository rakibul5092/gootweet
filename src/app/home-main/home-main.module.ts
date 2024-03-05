import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgPipesModule } from "ngx-pipes";
import { ChatNormalPageModule } from "../chat/chat-normal/chat-normal.module";
import { HomeModule } from "../components/home-page/home.module";
import { ReelsModule } from "../components/home-page/reels/reels.module";
import { RightSideBarModule } from "../components/layouts/right-side-bar/right-side-bar.module";
import { RequestPopupPage } from "../components/popovers/request-popup/request-popup.page";
import { PostModule } from "../components/post/post.module";
import { ProfilePhotoModule } from "../components/utils/profile-photo/profile-photo.module";
import { VideoModule } from "../components/video/video.module";
import { SharedDirectiveModule } from "../directives/shared-directive/shared-directive.module";
import { GetImageModule } from "../pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "../pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { HomeMainPageRoutingModule } from "./home-main-routing.module";
import { HomeMainPage } from "./home-main.page";
import { UserMobileMenuPageModule } from "./user-mobile-menu/user-mobile-menu.module";
import { MyInfoModule } from "../components/layouts/my-info/my-info.module";
import { MenuModule } from "../components/menu-items/menu.module";
// home.module.ts
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomeMainPageRoutingModule,
    UserMobileMenuPageModule,
    ChatNormalPageModule,
    MyInfoModule,
    PostModule,
    SharedDirectiveModule,
    SanitizeImagePipeModule,
    GetImageModule,
    LazyLoadImageModule,
    HomeModule,
    RightSideBarModule,
    VideoModule,
    ProfilePhotoModule,
    NgPipesModule,
    ReelsModule,
    MenuModule,
  ],
  declarations: [HomeMainPage, RequestPopupPage],
})
export class HomeMainPageModule {}
