import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { NgPipesModule } from "ngx-pipes";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { MyInfoComponent } from "./my-info.component";
import { ProfilePhotoModule } from "../../utils/profile-photo/profile-photo.module";

@NgModule({
  declarations: [MyInfoComponent],
  imports: [
    CommonModule,
    SanitizeImagePipeModule,
    RouterModule,
    IonicModule,
    NgPipesModule,
    ProfilePhotoModule,
    FormsModule,
  ],
  exports: [MyInfoComponent],
})
export class MyInfoModule {}
