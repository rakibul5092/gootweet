import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { lastValueFrom, map } from "rxjs";
import { transactions, wallet } from "../constants";
import { Transaction, WalletData } from "../models/wallet";

@Injectable({
  providedIn: "root",
})
export class WalletService {
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  async checkWallet(uid: string): Promise<boolean> {
    return await lastValueFrom(
      this.firestore.collection(wallet).doc(uid).get()
    ).then((value) => {
      if (value.exists) {
        return true;
      } else {
        return false;
      }
    });
  }

  requestPaysera(
    project_id: string,
    password: string,
    id: string,
    amount: string,
    uid: string,
    test: number
  ) {
    let post = new FormData();
    post.append("project_id", project_id);
    post.append("password", password);
    post.append("id", id);
    post.append("amount", amount);
    post.append("uid", uid);
    post.append("test", test + "");
    const url = "https://api.gootweet.com/paysera/topup-request.php";

    return this.http.post(url, post);
  }

  async generateWallet(uid: string, walletObj: WalletData) {
    return await this.firestore.collection(wallet).doc(uid).set(walletObj);
  }

  getWalletData(uid: string) {
    return this.firestore.collection(wallet).doc(uid).get();
  }
  cashout(uid: string, transObj: Transaction) {
    return this.firestore
      .collection("wallet")
      .doc(uid)
      .collection("transactions")
      .add(transObj);
  }
  getWalletTransactions(uid: string) {
    return this.firestore
      .collection(wallet)
      .doc(uid)
      .collection(transactions, (ref) =>
        ref
          .where("isPaid", "==", true)
          .where("isCompleted", "==", true)
          .orderBy("timestamp", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            return {
              ...a.payload.doc.data(),
              id: a.payload.doc.id,
            } as Transaction;
          });
        })
      );
  }

  async topUpWallet(uid: string, newAmount: number) {
    return await this.firestore
      .collection(wallet)
      .doc(uid)
      .set({ balance: newAmount }, { merge: true });
  }

  async addTransaction(uid: string, transObj: Transaction) {
    return await this.firestore
      .collection(wallet)
      .doc(uid)
      .collection(transactions)
      .add(transObj);
  }
  getFurniinAccInfo() {
    return this.firestore.collection("account_info").doc("furniin.com").get();
  }
}
