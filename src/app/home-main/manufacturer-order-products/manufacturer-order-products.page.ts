import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { getUser } from "src/app/services/functions/functions";
import { users } from "../../constants";
import { FinalSortedCartItem } from "../../models/product";
import { User, UserExtend } from "../../models/user";
import { ManufacturerOrderService } from "../manufacturer/manufacturer-order/manufacturer-order.service";

@Component({
  selector: "app-manufacturer-order-products",
  templateUrl: "./manufacturer-order-products.page.html",
  styleUrls: ["./manufacturer-order-products.page.scss"],
})
export class ManufacturerOrderProductsPage implements OnInit {
  isLoggedIn = false;
  order: any = null;
  me: User;
  userData: UserExtend;
  orderId: string;

  constructor(
    private firestore: AngularFirestore,
    private service: ManufacturerOrderService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private nav: NavController
  ) {}

  back() {
    this.nav.navigateBack("/profile/manufacturer-order", {
      animated: true,
      animationDirection: "back",
    });
  }
  ngOnInit() {
    getUser().then((user: User) => {
      this.me = user;
      if (this.me.rule == "user" || this.me.rule == "designer") {
        this.navController.navigateRoot("/");
      }
      this.isLoggedIn = true;
      this.activatedRoute.queryParams.pipe(first()).subscribe((queryParam) => {
        if (queryParam && queryParam.order_id) {
          this.orderId = queryParam.order_id;
          this.service
            .findOrderById(this.me.uid, this.orderId)
            .pipe(first())
            .subscribe((query) => {
              this.order = null;
              const cartItem: FinalSortedCartItem =
                query.payload.data() as FinalSortedCartItem;
              cartItem.id = query.payload.id;
              this.order = cartItem;
            });
          this.firestore
            .collection(users)
            .doc(this.me.uid)
            .get()
            .pipe(first())
            .subscribe((userQuery) => {
              this.userData = userQuery.data() as UserExtend;
            });
        }
      });
    });
  }
  setInProgress(order_id: string, status: boolean) {
    this.service.setInProgress(this.me.uid, order_id, status).then(() => {});
  }
  setSent(order_id: string, status: boolean) {
    this.service.setSent(this.me.uid, order_id, status).then(() => {
      console.log("sent");
    });
  }
}
