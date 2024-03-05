import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { users } from "../../constants";
import { FinalSortedCartItem } from "../../models/product";
import { User, UserExtend } from "../../models/user";
import { UserOrderProductsService } from "./user-order-products.service";
import { GotoProfileService } from "../../services/goto-profile.service";
import { first } from "rxjs/operators";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-user-order-products",
  templateUrl: "./user-order-products.page.html",
  styleUrls: ["./user-order-products.page.scss"],
})
export class UserOrderProductsPage implements OnInit, OnDestroy {
  order: any = null;
  me: User;
  userData: UserExtend;
  isLoggedIn: boolean = false;
  orderId: string;
  orderSubs: any;

  constructor(
    private angularFirestore: AngularFirestore,
    private userOrderProductService: UserOrderProductsService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private gotoProfileService: GotoProfileService,
    private loginService: LoginService
  ) {}
  ngOnDestroy(): void {
    if (this.orderSubs) this.orderSubs.unsubscribe();
  }

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      this.me = user;

      if (this.me.rule == "designer") {
        this.navController.navigateRoot("/");
      }
      this.isLoggedIn = true;
      this.activatedRoute.queryParams.pipe(first()).subscribe((queryParam) => {
        if (queryParam && queryParam.order_id) {
          this.orderId = queryParam.order_id;
          this.orderSubs = this.userOrderProductService
            .findUOrder(this.me.uid, this.orderId)
            .subscribe((query) => {
              this.order = null;
              const cartItem: FinalSortedCartItem =
                query.payload.data() as FinalSortedCartItem;
              cartItem.id = query.payload.id;
              this.order = cartItem;
            });
          this.angularFirestore
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

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  gotoUserOrder() {
    this.navController.navigateBack("/user-order");
  }
}
