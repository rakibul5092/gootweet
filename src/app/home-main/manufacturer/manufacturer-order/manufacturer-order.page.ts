import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { FinalSortedCartItem } from "../../../models/product";
import { User } from "../../../models/user";
import { ManufacturerOrderService } from "./manufacturer-order.service";
import { getUser } from "../../../services/functions/functions";

@Component({
  selector: "app-manufacturer-order",
  templateUrl: "./manufacturer-order.page.html",
  styleUrls: ["./manufacturer-order.page.scss"],
})
export class ManufacturerOrderPage implements OnInit, OnDestroy {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  isLoggedIn = false;
  me: User;
  deliveredOrders = [];

  orders: FinalSortedCartItem[] = [];
  findOrderSubs: any;

  constructor(
    private manufacturerOrderService: ManufacturerOrderService,
    private navController: NavController
  ) {}
  ngOnDestroy(): void {
    if (this.findOrderSubs) this.findOrderSubs.unsubscribe();
  }

  gotoOrderProducts(id) {
    const data: NavigationExtras = {
      queryParams: {
        order_id: id,
      },
    };
    this.navController.navigateForward("manufacturer-order-products", data);
  }

  ngOnInit() {
    getUser().then((user: User) => {
      this.me = user;
      this.profileCheckEvent.emit(true);
      this.isLoggedIn = true;
      this.findOrderSubs = this.manufacturerOrderService
        .findOrder(this.me.uid)
        .subscribe((query) => {
          this.orders = [];
          query.forEach((item) => {
            const cartItem: FinalSortedCartItem =
              item.payload.doc.data() as FinalSortedCartItem;
            cartItem.id = item.payload.doc.id;
            this.orders.push(cartItem);
          });
        });
    });
  }
}
