import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Product } from "../models/product";
import { User } from "../models/user";
import { ProductPopupService } from "./product-popup.service";

@Injectable({
  providedIn: "root",
})
export class OpenSingleProductService {
  constructor(
    private productPopupService: ProductPopupService,
    private navController: NavController
  ) {}
  openSingleProduct(pro: Product, productOwner: User) {
    this.productPopupService.productData = {
      isClicked: true,
      product: pro,
      productOwner: productOwner,
    };

    let title = pro.title.replace(/[\s\/\\()]/g, "-");
    let url = "product/" + title + "-" + pro.id + "-" + productOwner.uid;

    this.navController.navigateForward(url);
  }
}
