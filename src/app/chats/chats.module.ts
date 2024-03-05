import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChatsPageRoutingModule } from "./chats-routing.module";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SanitizeImagePipeModule } from "../pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SharedPipeModule } from "../pipes/shared-pipe/shared-pipe.module";
import { ChatsPage } from "./chats.page";
import { NgPipesModule } from "ngx-pipes";
import { LazyLoadImageModule } from "ng-lazyload-image";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChatsPageRoutingModule,
    SharedPipeModule,
    SanitizeImagePipeModule,
    NgPipesModule,
    LazyLoadImageModule,
  ],
  declarations: [ChatsPage],
})
export class ChatsPageModule {}
