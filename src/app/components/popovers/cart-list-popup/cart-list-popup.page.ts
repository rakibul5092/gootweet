import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { cart, products } from "../../../constants";
import { ProductDataForCart } from "../../../models/product";
import { User } from "../../../models/user";

import { NavController, PopoverController } from "@ionic/angular";
import { map } from "rxjs/operators";
import { getUser } from "src/app/services/functions/functions";
import { ScreenService } from "../../../services/screen.service";

@Component({
  selector: "app-cart-list-popup",
  templateUrl: "./cart-list-popup.page.html",
  styleUrls: ["./cart-list-popup.page.scss"],
})
export class CartListPopupPage implements OnInit, OnDestroy {
  user: User;
  cartItems: ProductDataForCart[] = [];
  totalCartPrice: number = 0;
  hideLoader = false;
  cartItemsSubs: any;
  isEmpty = false;

  constructor(
    public screen: ScreenService,
    private fs: AngularFirestore,
    private navController: NavController,
    private popOver: PopoverController
  ) {}
  ngOnDestroy(): void {
    if (this.cartItemsSubs) this.cartItemsSubs.unsubscribe();
  }

  ngOnInit() {
    getUser().then((user) => {
      this.user = user;
      this.getCartItems(this.user.uid);
    });
  }

  getCartItems(userUid) {
    this.cartItemsSubs = this.fs
      .collection(cart)
      .doc(userUid)
      .collection(products, (ref) => ref.orderBy("cart_time", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const item = {
              cart_item_id: a.payload.doc.id,
              data: a.payload.doc.data(),
              websiteCommision: 0,
              designerCommission: 0,
            } as ProductDataForCart;
            return item;
          });
        })
      )
      .subscribe((data) => {
        this.hideLoader = true;
        this.cartItems = data;
        if (data.length === 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      });
  }

  // removeFromCart(cartItemId: string) {
  //   this.fs
  //     .collection(cart)
  //     .doc(this.user.uid)
  //     .collection(products)
  //     .doc(cartItemId)
  //     .delete()
  //     .then(() => {
  //       this.service.getCartItems(this.user.uid);
  //     })
  //     .catch(() => {
  //       this.utils.showToast("Ivyko klaida, mėginkite dar kartą.", "error");
  //     });
  // }

  async gotoFullCart() {
    await this.popOver.dismiss();
    this.navController.navigateForward("purchase");
  }
}
