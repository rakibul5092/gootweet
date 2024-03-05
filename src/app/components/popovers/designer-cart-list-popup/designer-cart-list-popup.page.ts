import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavParams, PopoverController } from "@ionic/angular";
import { first } from "rxjs/operators";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
  getUser,
} from "src/app/services/functions/functions";
import { cart, products } from "../../../constants";
import { ProductDataForCart, ProductForCart } from "../../../models/product";
import { User } from "../../../models/user";
import { ScreenService } from "../../../services/screen.service";
import { UtilityService } from "../../../services/utility.service";

@Component({
  selector: "app-designer-cart-list-popup",
  templateUrl: "./designer-cart-list-popup.page.html",
  styleUrls: ["./designer-cart-list-popup.page.scss"],
})
export class DesignerCartListPopupPage implements OnInit, OnDestroy {
  user: User;
  designerInfo: User;
  cartItems: ProductDataForCart[] = [];
  totalCartPrice: number = 0;
  hideLoader = false;
  cartItemsSubs: any;

  constructor(
    public screen: ScreenService,
    private fs: AngularFirestore,
    private utils: UtilityService,
    private navParams: NavParams,
    private popoverController: PopoverController
  ) {}
  ngOnDestroy(): void {
    if (this.cartItemsSubs) this.cartItemsSubs.unsubscribe();
  }

  ngOnInit() {
    getUser().then((user) => {
      this.designerInfo = user;
      if (this.navParams.data) {
        this.user = this.navParams.get("user_info");
      }
      this.getCartItems();
    });
  }

  close() {
    this.popoverController.dismiss();
  }

  sendCart() {
    if (this.cartItems.length > 0) {
      let url = "https://gootweet.com/purchase?uid=" + this.user.uid;
      this.popoverController.dismiss(url);
    } else {
      this.utils.showToast("Tuščias krepšelis", "danger");
    }
  }

  copyToClipboard(uid: string) {
    let item = "https://gootweet.com/purchase?uid=" + uid;
    document.addEventListener("copy", (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", item);
      e.preventDefault();
      document.removeEventListener("copy", null);
    });
    document.execCommand("copy");
    this.utils.showToast("Copied", "success");
  }

  getCartItems() {
    this.cartItemsSubs = this.fs
      .collection(cart)
      .doc(this.user.uid)
      .collection(products, (ref) =>
        ref
          .orderBy("cart_time", "desc")
          .where("isDesigner", "==", true)
          .where("designerId", "==", this.designerInfo.uid)
      )
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
            websiteCommision: 0,
            designerCommission: 0,
          });
          this.totalCartPrice =
            +this.totalCartPrice + +cartItem.cart_price * +cartItem.quantity;
        });
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
      .catch((err) => {
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
            .catch((err) => {
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
        this.getCartItems();
      })
      .catch((err) => {
        this.utils.showToast("Ivyko klaida, mėginkite dar kartą.", "error");
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
}
