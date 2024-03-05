import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SinglePostPageRoutingModule } from "./single-post-routing.module";

import { SinglePostPage } from "./single-post.page";
import { PostModule } from "../components/post/post.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinglePostPageRoutingModule,
    PostModule,
  ],
  declarations: [SinglePostPage],
})
export class SinglePostPageModule {}
