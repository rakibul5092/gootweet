import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { cart, products } from "src/app/constants";
import { User } from "src/app/models/user";
import { CartListPopupService } from "../../popovers/cart-list-popup/cart-list-popup.service";

@Component({
  selector: "app-cart-item",
  templateUrl: "./cart-item.component.html",
  styleUrls: ["./cart-item.component.scss"],
})
export class CartItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isBottom = false;
  @Input() me: User;
  @Input() isProductMore = false;
  unseenCartItem: number = 0;
  unseenCartCountSubs: any;
  constructor(
    private nav: NavController,
    private firestore: AngularFirestore,
    public cartListPopupService: CartListPopupService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      this.getUnseenCartCount();
    }
  }
  ngOnDestroy(): void {
    if (this.unseenCartCountSubs) this.unseenCartCountSubs.unsubscribe();
  }

  ngOnInit() {}

  openCartPopover(event: any) {
    if (this.me) {
      this.cartListPopupService.openCartPopover(event);
    } else {
      this.nav.navigateForward("purchase");
    }
  }
  getUnseenCartCount() {
    this.unseenCartCountSubs = this.firestore
      .collection(cart)
      .doc(this.me?.uid)
      .collection(products, (ref) => ref.where("seen", "==", false))
      .snapshotChanges()
      .subscribe((query) => {
        this.unseenCartItem = query.length;
      });
  }
}
