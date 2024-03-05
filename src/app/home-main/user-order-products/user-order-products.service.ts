import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  orders_designer,
  orders_manufacturer,
  orders_user,
} from "../../constants";

@Injectable({
  providedIn: "root",
})
export class UserOrderProductsService {
  constructor(private firestore: AngularFirestore) {}

  findUOrder(uid, orderId) {
    return this.firestore
      .collection(orders_user)
      .doc(uid)
      .collection(orders_user)
      .doc(orderId)
      .snapshotChanges(); //, (ref) => ref.orderBy("timestamp", "desc").limit(10)
  }

  findDOrder(uid, orderId) {
    return this.firestore
      .collection(orders_designer)
      .doc(uid)
      .collection(orders_designer)
      .doc(orderId); //, (ref) => ref.orderBy("timestamp", "desc").limit(10)
  }
}
