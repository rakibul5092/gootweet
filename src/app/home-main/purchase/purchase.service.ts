import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import {
  cloud_function_base_url,
  commissions,
  orders_user,
} from "../../constants";
import { FinalSortedCartItem, SortedCartItems } from "../../models/product";
import { User } from "../../models/user";
import { UtilityService } from "../../services/utility.service";
import * as CircularJson from "circular-json";
import { getTimestamp } from "../../services/functions/functions";
import { HttpClient } from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { first } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class PurchaseService {
  constructor(
    private firestore: AngularFirestore,
    private util: UtilityService,
    private nav: NavController,
    private http: HttpClient
  ) {}

  async getFinalSortedCartItems(
    sortedCartItems: SortedCartItems[],
    buyerUid: string,
    finalSortedItems: FinalSortedCartItem[],
    user: User,
    uid: string
  ) {
    console.log(sortedCartItems);

    sortedCartItems.forEach((cartItem, index) => {
      const tempCartItem = { ...cartItem } as FinalSortedCartItem;
      tempCartItem.buyerUid = buyerUid;
      tempCartItem.isCompleted = false;
      tempCartItem.isDelivered = false;
      tempCartItem.isPaid = false;
      tempCartItem.isAvailable = true;
      tempCartItem.note = "";
      finalSortedItems.push(tempCartItem);
      if (index == sortedCartItems.length - 1) {
        this.calculateCommissions(tempCartItem, true, user, uid);
      } else {
        this.calculateCommissions(tempCartItem, false, user, uid);
      }
    });
  }

  calculateCommissions(
    cartItem: FinalSortedCartItem,
    flag: boolean,
    user: User,
    uid: string
  ) {
    cartItem.products.forEach((prod, index) => {
      prod.websiteCommision = 0;
      prod.designerCommission = 0;
      this.getCommissions(
        cartItem.ownerUid,
        prod.data.category.id,
        prod.data.designerId,
        prod.data.cart_price
      )
        .pipe(first())
        .subscribe(async (res: any) => {
          if (res.status) {
            let distributedCommission = res.data;
            prod.websiteCommision = distributedCommission.website_commission;
            prod.designerCommission = distributedCommission.designer_commission;
            cartItem.isAvailable = true;
            if (cartItem.products.length - 1 == index) {
              cartItem.timestamp = getTimestamp();
              await this.firestore
                .collection(orders_user)
                .doc(user.uid)
                .collection(orders_user)
                .doc(cartItem.ownerUid)
                .set(cartItem);
              if (flag) {
                await this.util.dismiss();
                if (uid) {
                  let navExtra: NavigationExtras = {
                    queryParams: {
                      uid: uid,
                    },
                  };
                  this.nav.navigateForward("purchase/payment", navExtra);
                } else {
                  this.nav.navigateForward("purchase/information");
                }
              }
            }
          } else {
            cartItem.isAvailable = false;
            cartItem.message =
              "Produktas neturi komisinių. Kontaktuokite su pardavėju";
            await this.util
              .showAlert(
                "Klaida",
                "Produkto (ID: " + prod?.data?.product_id + "), neįmanomas"
              )
              .then(async () => {
                await this.util.dismiss();
              });
          }
        });
    });
  }

  getCommissions(
    manufacturer_uid: string,
    catId: string,
    designer_uid: string,
    total_price: any
  ) {
    let url =
      cloud_function_base_url +
      "/get_distributed_commission?manufacturer_uid=" +
      manufacturer_uid +
      "&cat_id=" +
      catId +
      "&designer_uid=" +
      designer_uid +
      "&total_price=" +
      total_price;
    return this.http.get(url);
  }

  async saveSortedItems(sortedCartItems: SortedCartItems[]) {
    if (AppComponent.isBrowser.value) {
      localStorage.setItem(
        "sorteditems",
        CircularJson.stringify(sortedCartItems)
      );
    }
  }
  async getLocalSortedItems() {
    let localSortedItems: SortedCartItems[] = [];
    if (!AppComponent.isBrowser.value) {
      return localSortedItems;
    }
    const res = localStorage.getItem("sorteditems");
    if (res) {
      localSortedItems = JSON.parse(res);
    } else {
      localSortedItems = [];
    }
    return localSortedItems;
  }

  async getUnpaidOrderCount(uid: string): Promise<number> {
    return await lastValueFrom(
      this.firestore
        .collection(orders_user)
        .doc(uid)
        .collection(orders_user, (ref) =>
          ref.where("isCompleted", "==", false).where("isPaid", "==", false)
        )
        .get()
    ).then((query) => {
      return query?.docs ? query?.docs?.length : 0;
    });
  }
}
