import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { WallPost } from "../models/wall-test";
import { ProductPopupService } from "./product-popup.service";

@Injectable({
  providedIn: "root",
})
export class OpenProductService {
  constructor(
    private productPopupService: ProductPopupService,
    private navController: NavController
  ) {}

  openProductFromRoot(post: WallPost, clickedProduct: number) {
    this.productPopupService.postData = {
      isClicked: true,
      wallPost: post,
      clickedProduct: clickedProduct,
    };
    let title = post.data.title.replace(/[\s\/\\()]/g, "-");
    let url = "post/" + title + "-" + post.id;
    this.navController.navigateForward(url, {
      queryParams: { index: clickedProduct },
    });
  }
}
