import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { AppComponent } from "src/app/app.component";
import { CartListPopupService } from "src/app/components/popovers/cart-list-popup/cart-list-popup.service";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
  getTimestamp,
} from "src/app/services/functions/functions";
import { cart, products } from "../../constants";
import { SelectiveLoadingStrategy } from "../../custom-preload-strategy";
import {
  FinalSortedCartItem,
  ProductDataForCart,
  ProductForCart,
  SortedCartItems,
} from "../../models/product";
import { User } from "../../models/user";
import { UtilityService } from "../../services/utility.service";
import { ProfileService } from "../manufacturer/profile-test/profile.service";
import { PurchaseService } from "./purchase.service";
import { LoginService } from "src/app/services/login.service";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.page.html",
  styleUrls: ["./purchase.page.scss"],
})
export class PurchasePage implements OnInit, OnDestroy {
  user: User;
  uid: string;
  cartItems: ProductDataForCart[] = [];
  totalCartPrice: number = 0;
  hideLoader = false;
  sortedCartItems: SortedCartItems[] = [];
  cartTimeSubs: any;

  constructor(
    private navController: NavController,
    private cartListService: CartListPopupService,
    private profileService: ProfileService,
    private util: UtilityService,
    private angularFirestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private service: PurchaseService,
    private strategy: SelectiveLoadingStrategy,
    private loginService: LoginService
  ) {}
  ngOnDestroy(): void {
    if (this.cartTimeSubs) this.cartTimeSubs.unsubscribe();
  }

  ngOnInit() {
    this.sortedCartItems = [];
    setTimeout(() => {
      this.strategy.preLoadRoute(["information", "payment"]);
    }, 1000);
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.uid) {
        this.uid = params.uid;
        this.load(this.uid, true);
      } else {
        this.loginService.getUser().then(async (user: User) => {
          this.user = user;
          if (user) {
            if (this.cartItems.length == 0) {
              this.load(this.user.uid, false);
            }
          } else {
            this.cartListService.getLocalCartItems().then((cartItems) => {
              this.cartItems = cartItems;
              this.sortedCartItem(cartItems);
            });
          }
        });
      }
    });
  }

  checkMaterial(item) {
    if (item?.data?.good?.material) {
      return true;
    } else {
      return false;
    }
  }

  MaterialCodeForCartList(good: any) {
    if (good) {
      return good.code;
    } else {
      return "";
    }
  }

  load(uid: string, outside: boolean) {
    let outsideCartItems: ProductForCart[] = [];
    this.cartTimeSubs = this.angularFirestore
      .collection(cart)
      .doc(uid)
      .collection(products, (ref) => ref.orderBy("cart_time", "desc"))
      .get()
      .subscribe((cartQuery) => {
        this.cartItems = [];
        this.totalCartPrice = 0;
        this.hideLoader = true;
        cartQuery.forEach((cartItemQuery) => {
          const cartItem = cartItemQuery.data() as ProductForCart;
          const cartItemId = cartItemQuery.id;
          if (outside) {
            outsideCartItems.push(cartItem);
          } else {
            this.cartItems.push({
              cart_item_id: cartItemId,
              data: cartItem,
              designerCommission: 0,
              websiteCommision: 0,
            });
            this.totalCartPrice = +this.totalCartPrice + +cartItem.cart_price;
          }
        });

        if (outsideCartItems.length > 0 && outside) {
          if (AppComponent.isBrowser.value) {
            this.cartListService.getLocalCartItems().then((cartItems) => {
              this.cartItems = cartItems;
              this.sortedCartItem(cartItems);
            });
          }
        } else if (this.cartItems.length > 0 && !outside) {
          this.sortedCartItem(this.cartItems);
        }
      });
  }

  async increseQnt(prod: ProductDataForCart) {
    prod.data.quantity += 1;
    const updatedPrice = +(prod.data.good as any).price * prod.data.quantity;
    prod.data.cart_price = updatedPrice;
    if (this.user) {
      const increment = getFirestoreIncrement();
      await this.updateFirebaseCart(increment, prod);
    } else {
      const cartItems = this.cartItems.map((item) => item.data);
      this.cartListService.saveLocalCarts(cartItems);
    }
  }

  async decreaseQnt(prod: ProductDataForCart) {
    if (prod.data.quantity === 1) {
      return;
    }
    prod.data.quantity -= 1;
    const updatedPrice = +(prod.data.good as any).price * prod.data.quantity;
    prod.data.cart_price = updatedPrice;
    if (this.user) {
      const decrement = getFirestoreDecrement();
      await this.updateFirebaseCart(decrement, prod);
    } else {
      const cartItems = this.cartItems.map((item) => item.data);
      this.cartListService.saveLocalCarts(cartItems);
    }
  }

  async updateFirebaseCart(quantity: any, prod: ProductDataForCart) {
    await this.angularFirestore
      .collection(cart)
      .doc(this.user.uid)
      .collection(products)
      .doc(prod.cart_item_id)
      .update({
        quantity: quantity,
        cart_price: prod.data.cart_price,
      })
      .catch((err) => {
        console.log("Something went wrong! please try again.");
      });
  }

  async removeFromCart(prod: ProductDataForCart, i: number, j: number) {
    if (this.sortedCartItems[i].products.length === 1) {
      this.sortedCartItems.splice(i, 1);
    } else {
      this.sortedCartItems[i].products.splice(j, 1);
    }
    let index = this.cartItems.indexOf(prod);
    this.cartItems.splice(index, 1);
    if (this.user) {
      await this.angularFirestore
        .collection(cart)
        .doc(this.user.uid)
        .collection(products)
        .doc(prod.cart_item_id)
        .delete()
        .catch(async (err) => {
          await this.util.showToast("Bandykite dar kartą.", "error");
        });
    } else {
      const cartItems = this.cartItems.map((item) => item.data);
      this.cartListService.saveLocalCarts(cartItems);
    }
  }

  async sortedCartItem(allCartItems) {
    this.sortedCartItems = [];
    for (const item of allCartItems) {
      let ownerId = item.data.ownerId;
      if (this.sortedCartItems.find((sci) => sci.ownerUid === ownerId)) {
        let index = this.sortedCartItems
          .map((scii) => scii.ownerUid)
          .indexOf(ownerId);
        this.sortedCartItems[index].products.push(item);
      } else {
        this.sortedCartItems.push({
          ownerUid: ownerId,
          owner: null,
          products: [item],
          totalPrice: 0,
          isPaid: false,
        });
      }
    }
    for (const sci of this.sortedCartItems) {
      if (!sci.owner) {
        const pOwnerQuery = await lastValueFrom(
          this.profileService.getProductOwner(sci.ownerUid).get().pipe(first())
        );
        sci.owner = pOwnerQuery.data() as User;
        sci.totalPrice = this.getTotalPrice(sci.products);
        sci.isPaid = false;
      }
    }

    this.sortedCartItems.forEach(async (sci) => {});
  }

  getTotalPrice(products: ProductDataForCart[]): number {
    let totalPrice = 0;
    products.forEach((item) => {
      totalPrice += Number(item.data.cart_price);
    });
    return totalPrice;
  }

  finalSortedItems: FinalSortedCartItem[] = [];
  async gotoPurchaseTwo() {
    this.finalSortedItems = [];
    if (this.user) {
      await this.util.present("Atnaujinama");
      this.service.getFinalSortedCartItems(
        this.sortedCartItems,
        this.user.uid,
        this.finalSortedItems,
        this.user,
        null
      );
    } else {
      await this.util.present("Atnaujinama");
      this.service
        .saveSortedItems(this.sortedCartItems)
        .then(async () => {
          await this.util.dismiss();
          if (this.uid) {
            let navExtra: NavigationExtras = {
              queryParams: {
                uid: this.uid,
              },
            };
            this.navController.navigateForward(
              "purchase/information",
              navExtra
            );
          } else {
            this.navController.navigateForward("purchase/information");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onBack() {
    this.navController.navigateBack("");
  }

  gotoPayment() {
    this.navController.navigateForward("purchase/payment");
  }
}
