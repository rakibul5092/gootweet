import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatsComponent } from "./chats/chats.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { LiveProductsComponent } from "./live-products/live-products.component";
import { LazyLoadImageModule } from "ng-lazyload-image";

@NgModule({
  declarations: [ChatsComponent, LiveProductsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SanitizeImagePipeModule,
    LazyLoadImageModule,
  ],
  exports: [ChatsComponent, LiveProductsComponent],
})
export class LiveModule {}
