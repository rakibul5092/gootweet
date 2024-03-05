import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { orders_manufacturer } from "../../../constants";

@Injectable({
  providedIn: "root",
})
export class ManufacturerOrderService {
  constructor(private firestore: AngularFirestore) {}

  findOrder(uid: string) {
    return this.firestore
      .collection(orders_manufacturer)
      .doc(uid)
      .collection(orders_manufacturer)
      .snapshotChanges(); //, (ref) => ref.orderBy("timestamp", "desc").limit(10)
  }

  findOrderById(uid: string, orderId: string) {
    return this.firestore
      .collection(orders_manufacturer)
      .doc(uid)
      .collection(orders_manufacturer)
      .doc(orderId)
      .snapshotChanges(); //, (ref) => ref.orderBy("timestamp", "desc").limit(10)
  }

  setInProgress(uid: string, order_id: string, status: boolean) {
    return this.firestore
      .collection(orders_manufacturer)
      .doc(uid)
      .collection(orders_manufacturer)
      .doc(order_id)
      .update({ inProgress: !status });
  }
  setSent(uid: string, order_id: string, status: boolean) {
    return this.firestore
      .collection(orders_manufacturer)
      .doc(uid)
      .collection(orders_manufacturer)
      .doc(order_id)
      .update({ sent: !status });
  }
}
