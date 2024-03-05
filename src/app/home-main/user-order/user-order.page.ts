import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { FinalSortedCartItem } from "../../models/product";
import { User } from "../../models/user";
import { UserOrderService } from "./user-order.service";
import { map } from "rxjs/operators";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-user-order",
  templateUrl: "./user-order.page.html",
  styleUrls: ["./user-order.page.scss"],
})
export class UserOrderPage implements OnInit, OnDestroy {
  isLoggedIn = false;
  me: User;
  deliveredOrders = [];

  orders: FinalSortedCartItem[] = [];
  orderSubs: any;

  constructor(
    private userOrderService: UserOrderService,
    private navController: NavController,
    private alertController: AlertController,
    private loginService: LoginService
  ) {}
  ngOnDestroy(): void {
    if (this.orderSubs) this.orderSubs.unsubscribe();
  }

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      this.me = user;
      this.isLoggedIn = true;
      if (this.me.rule == "designer") {
        this.navController.navigateRoot("/");
      }
      this.orderSubs = this.userOrderService
        .findOrder(this.me.uid)
        .pipe(
          map((actions) => {
            return actions.map((a) => {
              let item = a.payload.doc.data() as FinalSortedCartItem;
              item.id = a.payload.doc.id;
              return item;
            });
          })
        )

        .subscribe((items) => {
          this.orders = items;
        });
    });
  }

  gotoOrderProduts(id) {
    const data: NavigationExtras = {
      queryParams: {
        order_id: id,
      },
    };
    this.navController.navigateForward("user-order-products", data);
  }
  async askPermissionForDelete(order_id: string) {
    if (!this.me) {
      return;
    }
    let uid = this.me.uid;
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Patvirtinkite!",
      message: "Ar tiktai norite ištrinti?",
      mode: "ios",
      buttons: [
        {
          text: "Baigti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Ištrinti",
          handler: () => {
            this.removeFromOrder(uid, order_id);
          },
        },
      ],
    });
    alert.present();
  }

  removeFromOrder(uid: string, order_id: string) {
    this.userOrderService.removePurchased(uid, order_id);
  }
}
