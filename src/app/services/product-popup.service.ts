import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as CircularJson from "circular-json";
import {
  cart,
  chat_requests,
  cloud_function_base_url,
  products,
} from "src/app/constants";

import { AppComponent } from "../app.component";
import { SingleProduct } from "../models/product";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductPopupService {
  productData: SingleProduct;
  postData: any;

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.init();
  }
  init() {
    this.getLocalCart().then((localList: any[]) => {
      this.localCartList = localList;
    });
  }

  getDeliveryInfo(uid: string) {
    return this.afs.collection(products).doc(uid).get();
  }

  async checkIsRequested(
    userUid: string,
    designerUid: string
  ): Promise<boolean> {
    return await lastValueFrom(
      this.afs
        .collection(chat_requests)
        .doc(designerUid)
        .collection(chat_requests)
        .doc(userUid)
        .get()
    ).then((query) => query.exists);
  }

  async addToCart(product, myUid) {
    return await this.afs
      .collection(cart)
      .doc(myUid)
      .collection(products)
      .add(product);
  }

  async getLocalCart() {
    let localCartList: any[] = [];

    if (!AppComponent.isBrowser.value) {
      return localCartList;
    }
    const carts = localStorage.getItem("localcart");
    if (carts) {
      localCartList = JSON.parse(carts);
    } else {
      localCartList = [];
    }
    return localCartList;
  }

  localCartList: any[] = [];
  async addToLocalCart(product: any) {
    this.localCartList = [];
    await this.getLocalCart()
      .then((localCarts: any[]) => {
        this.localCartList = localCarts;
        this.localCartList.push(product);
        if (!AppComponent.isBrowser.value) {
          return;
        }
        localStorage.setItem(
          "localcart",
          CircularJson.stringify(this.localCartList)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getRelatedProducts(category: string, uid: string) {
    return this.http.get(
      cloud_function_base_url +
        "/get_related_products?category=" +
        category +
        "&uid=" +
        uid
    );
  }
}
