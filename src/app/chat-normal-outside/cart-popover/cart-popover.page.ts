import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController, PopoverController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { CartListPopupService } from "src/app/components/popovers/cart-list-popup/cart-list-popup.service";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
} from "src/app/services/functions/functions";
import { cart, products } from "../../constants";
import { ProductDataForCart, ProductForCart } from "../../models/product";
import { User } from "../../models/user";
import { LoginService } from "../../services/login.service";
import { ScreenService } from "../../services/screen.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-cart-popover",
  templateUrl: "./cart-popover.page.html",
  styleUrls: ["./cart-popover.page.scss"],
})
export class CartPopoverPage implements OnInit, OnDestroy {
  user: User;
  cartItems: ProductDataForCart[] = [];
  totalCartPrice: number = 0;
  hideLoader = false;

  //imported functions

  constructor(
    public screen: ScreenService,
    private fs: AngularFirestore,
    private loginService: LoginService,
    public utils: UtilityService,
    private nav: NavController,
    private popOver: PopoverController,
    public service: CartListPopupService
  ) {}
  ngOnDestroy(): void {
    if (this.cartSubs) this.cartSubs.unsubscribe();
  }

  ngOnInit() {
    this.loginService.getOutSideUser().then((user) => {
      this.user = user;
      this.getCartItems(this.user.uid);
    });
  }

  close() {
    this.popOver.dismiss();
  }

  openPurchasePage() {
    let url = "https://gootweet.com/purchase?uid=" + this.user.uid;
    window.open(url, "_blank");
  }
  cartSubs: Subscription;
  getCartItems(userUid) {
    this.cartSubs = this.fs
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
          this.cartItems.push({
            cart_item_id: cartItemId,
            data: cartItem,
            websiteCommision: 0,
            designerCommission: 0,
          });
          this.totalCartPrice =
            +this.totalCartPrice + +cartItem.cart_price * +cartItem.quantity;
        });
        return this.cartItems;
      });
  }

  increseQnt(cartItemId: string) {
    const increment = getFirestoreIncrement();
    const matchItem: any = this.cartItems.find(
      (item) => item.cart_item_id == cartItemId
    );
    let cTotalUnitOfMeasurment =
      +matchItem.data.good.quantity * (+matchItem.data.quantity + 1);

    this.fs
      .collection(cart)
      .doc(this.user.uid)
      .collection(products)
      .doc(cartItemId)
      .update({
        quantity: increment,
        totalUnitOfMeasurment: +cTotalUnitOfMeasurment.toFixed(2) || 0,
      })
      .then(() => {
        // this.getCartItems(this.user.uid);
      })
      .catch(() => {
        console.log("Something went wrong! please try again.");
      });
  }

  decreseQnt(cartItemId: string) {
    const decrement = getFirestoreDecrement();
    const matchItem: any = this.cartItems.find(
      (item) => item.cart_item_id == cartItemId
    );
    let cTotalUnitOfMeasurment =
      (+matchItem.data.quantity - 1) * +matchItem.data.good.quantity;
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
            .update({
              quantity: decrement,
              totalUnitOfMeasurment: +cTotalUnitOfMeasurment.toFixed(2) || 0,
            })
            .then(() => {
              // this.getCartItems(this.user.uid);
            })
            .catch(() => {
              console.log("Something went wrong! please try again.");
            });
        } else {
          this.utils.showToast("Jūs negalite tureti kiekį 0", "warning");
        }
      });
  }

  removeFromCart(cartItemId: string) {
    this.fs
      .collection(cart)
      .doc(this.user.uid)
      .collection(products)
      .doc(cartItemId)
      .delete()
      .then(() => {
        this.service.getCartItems(this.user.uid);
      })
      .catch(() => {
        this.utils.showToast("Ivyko klaida, mėginkite dar kartą.", "error");
      });
  }

  gotoFullCart() {
    this.popOver.dismiss();
    this.nav.navigateForward("purchase");
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
}
