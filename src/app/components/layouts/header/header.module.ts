import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "src/app/pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SharedPipeModule } from "src/app/pipes/shared-pipe/shared-pipe.module";
import { ChatsPageModule } from "../../../chats/chats.module";
import { BottomCategoryModalPage } from "../../bottom-category-modal/bottom-category-modal.page";
import { HomeModule } from "../../home-page/home.module";
import { CartListPopupPage } from "../../popovers/cart-list-popup/cart-list-popup.page";
import { NotificationsPage } from "../../popovers/notifications/notifications.page";
import { MenuModule } from "../../menu-items/menu.module";
import { HeaderPage } from "./header.page";
import { ProfilePhotoModule } from "../../utils/profile-photo/profile-photo.module";
import { NotificationComponent } from "../../popovers/notifications/notification/notification.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageModule,
    SanitizeImagePipeModule,
    GetImageModule,
    RouterModule,
    SharedPipeModule,
    NgPipesModule,
    HomeModule,
    MenuModule,
    ProfilePhotoModule,
  ],
  declarations: [
    HeaderPage,
    CartListPopupPage,
    NotificationsPage,
    NotificationComponent,
    BottomCategoryModalPage,
  ],
  exports: [HeaderPage],
})
export class HeaderPageModule {}
