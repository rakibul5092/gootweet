import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UserMobileMenuPageRoutingModule } from "./user-mobile-menu-routing.module";

import { UserMobileMenuPage } from "./user-mobile-menu.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { MyInfoModule } from "src/app/components/layouts/my-info/my-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserMobileMenuPageRoutingModule,
    SanitizeImagePipeModule,
    MyInfoModule,
  ],
  declarations: [UserMobileMenuPage],
  exports: [UserMobileMenuPage],
})
export class UserMobileMenuPageModule {}
