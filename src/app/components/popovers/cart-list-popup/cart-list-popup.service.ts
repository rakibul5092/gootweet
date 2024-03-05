import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as CircularJson from "circular-json";
import { first } from "rxjs/operators";
import { cart, products } from "../../../constants";
import { ProductDataForCart, ProductForCart } from "../../../models/product";
import { User } from "../../../models/user";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
  getUser,
} from "../../../services/functions/functions";
import { UtilityService } from "../../../services/utility.service";
import { PopoverController } from "@ionic/angular";
import { CartListPopupPage } from "./cart-list-popup.page";

@Injectable({
  providedIn: "root",
})
export class CartListPopupService implements OnDestroy {
  user: User;
  cartItems: ProductDataForCart[] = [];
  totalCartPrice: number = 0;
  hideLoader = false;
  cartItemsSubs: any;

  constructor(
    private fs: AngularFirestore,
    public utils: UtilityService,
    private popover: PopoverController,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    getUser().then((user: User) => {
      this.user = user;
      this.getLocalCartItems();
    });
  }
  ngOnDestroy(): void {
    if (this.cartItemsSubs) this.cartItemsSubs.unsubscribe();
  }

  isCart = false;
  async openCartPopover(event, style: any = "ios", auto = false) {
    let popover = await this.popover.create({
      component: CartListPopupPage,
      event: event,
      cssClass: "cart-pop",
      mode: style,
      animated: true,
    });
    this.isCart = true;
    popover.onDidDismiss().then((value: any) => {
      this.isCart = false;
    });
    await popover.present();

    if (auto) {
      setTimeout(async () => {
        await popover.dismiss();
      }, 3000);
    }
  }

  async getCartItems(userUid?) {
    if (userUid) {
      this.cartItemsSubs = this.fs
        .collection(cart)
        .doc(userUid)
        .collection(products, (ref) => ref.orderBy("cart_time", "desc"))
        .snapshotChanges()
        .subscribe((cartItems) => {
          this.cartItems = [];
          this.totalCartPrice = 0;
          this.hideLoader = true;
          cartItems.forEach((cartItemQuery) => {
            let cartItem = cartItemQuery.payload.doc.data() as ProductForCart;
            let cartItemId = cartItemQuery.payload.doc.id;

            // if(cartItem.seen == false){
            //   this.fs.collection(cart).doc(this.user.uid).collection(products).doc(cartItemId).set({seen: true}, {merge:true});
            // }

            this.cartItems.push({
              cart_item_id: cartItemId,
              data: cartItem,
              designerCommission: 0,
              websiteCommision: 0,
            });
            this.totalCartPrice =
              +this.totalCartPrice + +cartItem.cart_price * +cartItem.quantity;
          });
          return this.cartItems;
        });
    }
  }
  saveLocalCarts(cartItems: ProductForCart[]) {
    localStorage.setItem("localcart", CircularJson.stringify(cartItems));
  }
  async setLocalCartIems(pId: string, q: number) {
    let localCartList = [];
    await this.getLocalCart()
      .then((localCarts: any[]) => {
        let index = localCarts.findIndex((x) => x.product_id === pId);
        localCarts[index].quantity = Number(localCarts[index].quantity) + q;
        localCartList = localCarts;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(
            "localcart",
            CircularJson.stringify(localCartList)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async removeFromLocal(pId: string) {
    let localCartList = [];
    await this.getLocalCart()
      .then((localCarts: any[]) => {
        let index = localCarts.findIndex((x) => x.product_id === pId);
        localCarts.splice(index, 1);
        localCartList = localCarts;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(
            "localcart",
            CircularJson.stringify(localCartList)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async getLocalCartItems() {
    return await this.getLocalCart().then((localList: any[]) => {
      this.cartItems = [];
      this.totalCartPrice = 0;
      this.hideLoader = true;
      localList.forEach((cartItemQuery, index) => {
        let cartItem = cartItemQuery as ProductForCart;
        let cartItemId = cartItem.product_id;

        this.cartItems.push({
          cart_item_id: cartItemId + "",
          data: cartItem,
          designerCommission: 0,
          websiteCommision: 0,
        });
        this.totalCartPrice =
          +this.totalCartPrice + +cartItem.cart_price * +cartItem.quantity;
      });

      return this.cartItems;
    });
  }
  async getLocalCart() {
    let localCartList: any[] = [];
    if (isPlatformServer(this.platformId)) {
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

  increseQnt(productId: string, cartItemId: string, ownerId: string) {
    const increment = getFirestoreIncrement();
    const matchItem: any = this.cartItems.find(
      (item) => item.cart_item_id == cartItemId
    );

    this.fs
      .collection(products)
      .doc(ownerId)
      .collection(products)
      .doc(productId)
      .get()
      .pipe(first())
      .subscribe((query) => {
        let mGood;
        if (Array.isArray(query.data().good)) {
          mGood = query
            .data()
            .good.find((g) => g.code[0] == matchItem.data.good.code[0]);
        } else {
          mGood = query.data().good;
        }
        if (+mGood.inStock >= +matchItem.data.quantity + 1) {
          this.fs
            .collection(cart)
            .doc(this.user.uid)
            .collection(products)
            .doc(cartItemId)
            .update({ quantity: increment })
            .then(() => {
              this.getCartItems(this.user.uid);
            })
            .catch((err) => {
              console.log("Something went wrong! please try again.");
            });
        } else {
          this.utils.showToast("Your are crossing Stock limit", "warning");
        }
      });
  }

  decreseQnt(productId: string, cartItemId: string) {
    const decrement = getFirestoreDecrement();
    this.fs
      .collection(cart)
      .doc(this.user.uid)
      .collection(products)
      .doc(cartItemId)
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query.data().quantity > 0) {
          this.fs
            .collection(cart)
            .doc(this.user.uid)
            .collection(products)
            .doc(cartItemId)
            .update({ quantity: decrement })
            .then(() => {
              this.getCartItems(this.user.uid);
            })
            .catch((err) => {
              console.log("Something went wrong! please try again.");
            });
        } else {
          this.utils.showToast("Jūs negalite tureti kiekį 0", "warning");
        }
      });
  }
}
