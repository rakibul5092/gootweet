import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BankInfo } from "src/app/models/wallet";
import {
  orders_user,
  products,
  commissions,
  wallet,
  bank_info,
} from "../../../constants";
import {
  FinalSortedCartItem,
  OrderInfo,
  ProductDataForCart,
  SortedCartItems,
} from "../../../models/product";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  async getFinalSortedCartItems(
    sortedCartItems: SortedCartItems[],
    buyerUid: string,
    finalSortedItems: FinalSortedCartItem[]
  ) {
    sortedCartItems.forEach((cartItems) => {
      finalSortedItems.push(cartItems as FinalSortedCartItem);
    });
    finalSortedItems.forEach((cartItem) => {
      cartItem.buyerUid = buyerUid;
      cartItem.isCompleted = false;
      cartItem.isDelivered = false;
      cartItem.isPaid = false;
      cartItem.isAvailable = true;
      cartItem.note = "";
      this.calculateCommissions(cartItem);
    });
  }

  calculateCommissions(cartItem: FinalSortedCartItem) {
    cartItem.products.forEach((prod) => {
      prod.websiteCommision = 0;
      prod.designerCommission = 0;
      this.getCommissions(cartItem.ownerUid, prod.data.category.id).then(
        (commission) => {
          if (commission && commission !== "" && Number(commission)) {
            cartItem.isAvailable = true;
            let prodTotalPrice = Number(prod.data.cart_price);
            let prodCommissionAmount: number =
              (prodTotalPrice * Number(commission)) / 100;
            if (prod.data.isDesigner) {
              prod.designerCommission = prodCommissionAmount / 2;
              prod.websiteCommision = prodCommissionAmount / 2;
            } else {
              prod.websiteCommision = prodCommissionAmount;
            }
          } else {
            cartItem.isAvailable = false;
            cartItem.message =
              "Product don't have any commissions. Contact manufacturer for this solution";
          }
        }
      );
    });
  }

  async getCommissions(manufacturerUid: string, catId: string): Promise<any> {
    return await lastValueFrom(
      this.firestore
        .collection(commissions)
        .doc(manufacturerUid)
        .collection(commissions)
        .doc(catId)
        .get()
    ).then((query) => {
      return query.data()?.commission?.trim();
    });
  }

  requestPaysera(
    project_id: string,
    password: string,
    order_id: string,
    userUid: string,
    total: string,
    test: number,
    uid: string
  ) {
    let post = new FormData();
    post.append("order_id", order_id);
    post.append("total", total);
    post.append("project_id", project_id);
    post.append("password", password);
    post.append("test", test + "");
    post.append("uid", uid);
    post.append("user_uid", userUid);

    const url = "https://api.gootweet.com/paysera/payment-request.php";

    return this.http.post(url, post);
  }

  checkManufacturerWallet(uid: string) {
    return this.firestore.collection(wallet).doc(uid).get();
  }
  makePayment(
    manufacturerUid: string,
    userInfoWithOrderData: OrderInfo,
    prods: ProductDataForCart
  ) {
    this.firestore
      .collection(orders_user)
      .doc(manufacturerUid)
      .collection(orders_user)
      .add(userInfoWithOrderData)
      .then((result) => {
        let id = result.id;
        this.firestore
          .collection(orders_user)
          .doc(manufacturerUid)
          .collection(orders_user)
          .doc(id)
          .collection(products)
          .add(prods)
          .then((res) => {
            console.log(res);
          });
      });
  }

  async getManufacturerPayseraLogin(ownerUid: string): Promise<BankInfo> {
    return await lastValueFrom(
      this.firestore.collection(bank_info).doc(ownerUid).get()
    ).then((query) => {
      return query.data() as BankInfo;
    });
  }

  async updateShortNoteAndPrice(
    uid: string,
    ownerUid: string,
    shortNote: string,
    totalPrice: number,
    orderId: string
  ) {
    return await this.firestore
      .collection(orders_user)
      .doc(uid)
      .collection(orders_user)
      .doc(ownerUid)
      .set(
        { shortNote: shortNote, totalPrice: totalPrice, orderId: orderId },
        { merge: true }
      );
  }
}
