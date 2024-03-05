import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SearchResultPageRoutingModule } from "./search-result-routing.module";
import { SearchResultPage } from "./search-result.page";
import { NgPipesModule } from "ngx-pipes";
import { GetImageModule } from "../../pipes/share-module/get-image/get-image.module";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { HomeModule } from "src/app/components/home-page/home.module";
import { MyInfoModule } from "src/app/components/layouts/my-info/my-info.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultPageRoutingModule,
    NgPipesModule,
    MyInfoModule,
    GetImageModule,
    SanitizeImagePipeModule,
    HomeModule,
  ],
  declarations: [SearchResultPage],
})
export class SearchResultPageModule {}
