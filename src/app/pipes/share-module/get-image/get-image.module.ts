import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GetImagePipe } from "../../get-image.pipe";
import {GetSingleImagePipe} from "../../get-single-image.pipe";
import {GetMaterialImagePipe} from "../../get-material-image.pipe";
import {GetMaterialImageForCartListPipe} from "../../get-material-image-for-cart-list.pipe";
import {GetMImagePipe} from "../../get-m-image.pipe";
import {GetWallPostCoverImagePipe} from "../../get-wall-post-cover-image.pipe";

@NgModule({
  declarations: [
      GetImagePipe,
      GetSingleImagePipe,
      GetMaterialImagePipe,
      GetMaterialImageForCartListPipe,
      GetMImagePipe,
      GetWallPostCoverImagePipe
  ],
  imports: [CommonModule],
    exports: [
        GetImagePipe,
        GetSingleImagePipe,
        GetMaterialImagePipe,
        GetMaterialImageForCartListPipe,
        GetMImagePipe,
        GetWallPostCoverImagePipe
    ],
})
export class GetImageModule {}
