import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { orders_user } from "../../constants";

@Injectable({
  providedIn: "root",
})
export class UserOrderService {
  constructor(private firestore: AngularFirestore) {}

  findOrder(uid) {
    return this.firestore
      .collection(orders_user)
      .doc(uid)
      .collection(orders_user)
      .snapshotChanges(); //, (ref) => ref.orderBy("timestamp", "desc").limit(10)
  }
  async removePurchased(uid: string, order_id: string) {
    return await this.firestore
      .collection(orders_user)
      .doc(uid)
      .collection(orders_user)
      .doc(order_id)
      .delete();
  }
}
