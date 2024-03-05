import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { first, map } from "rxjs/operators";
import { BankInfo } from "src/app/models/wallet";
import { BANK_LOGOS, orders_user, products, users } from "../../../constants";
import {
  Delivery,
  FinalSortedCartItem,
  SortedCartItems,
} from "../../../models/product";
import { User } from "../../../models/user";
import { LoginService } from "../../../services/login.service";
import { UtilityService } from "../../../services/utility.service";
import { PaymentService } from "./payment.service";

interface FinalSortedCartItemExtra extends FinalSortedCartItem {
  selectedDeliveryType: Delivery;
  deliveryTypes: Delivery[];
  shortNote: string;
  deliveryTypeDoc: AngularFirestoreDocument<unknown>;
}

@Component({
  selector: "app-purchase-three",
  templateUrl: "./purchase-three.page.html",
  styleUrls: ["./purchase-three.page.scss"],
})
export class PurchaseThreePage implements OnInit, OnDestroy {
  me: User;
  uid: string;

  sortedCartItems: SortedCartItems[] = [];
  designer;
  finalPaidSortedItems: FinalSortedCartItemExtra[] = [];
  finalUnPaidSortedItems: FinalSortedCartItemExtra[] = [];
  isLoaded = false;

  activeCartItemNumber: number;
  loadFinalOrderSubs: any;
  bankLogos = BANK_LOGOS;

  constructor(
    private storage: LoginService,
    private firestore: AngularFirestore,
    private nav: NavController,
    private util: UtilityService,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}
  ngOnDestroy(): void {
    if (this.loadFinalOrderSubs) this.loadFinalOrderSubs.unsubscribe();
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.uid) {
        this.uid = params.uid;
        this.firestore
          .collection(users)
          .doc(params.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            this.me = query.data() as User;
            this.storage.saveEmail(this.me.email).then(() => {
              this.storage.savePurchaseUser(this.me).then(() => {
                this.loadFinalOrderData(this.me.uid);
              });
            });
          });
      } else {
        this.storage.getUser().then((user) => {
          if (user) {
            this.me = user;
            this.storage.savePurchaseUser(this.me).then(() => {
              this.loadFinalOrderData(this.me.uid);
            });
          }
        });
      }
    });
  }

  activeRealtime = true;
  async makePayment({ ownerUid, totalPrice, shortNote }) {
    await this.util.present("Palaukite...");

    await this.paymentService
      .getManufacturerPayseraLogin(ownerUid)
      .then(async (login: BankInfo) => {
        if (!login) {
          this.util.dismiss().then(() => {
            this.util.showAlert("", "Gamintojas neturi banko informacijos");
          });

          return;
        }
        this.activeRealtime = false;
        const orderId = new Date().getTime().toString();
        await this.paymentService
          .updateShortNoteAndPrice(
            this.me.uid,
            ownerUid,
            shortNote,
            totalPrice,
            orderId
          )
          .then(async () => {
            await this.util.dismiss();
            let project_id = login.project_id;
            let password = login.password;
            let test = login?.test;

            this.paymentService
              .requestPaysera(
                project_id,
                password,
                orderId,
                this.me.uid,
                totalPrice * 100 + "",
                test,
                ownerUid
              )
              .pipe(first())
              .subscribe((res: any) => {
                window.open(
                  res.url,
                  "Payment",
                  "menubar=1,resizable=0,width=550,height=700"
                );
                this.activeRealtime = true;

                // window.open(res.url, "_blank");
                //https://furniin.com/paysera/paysera/paysera-success.php?data=b3JkZXJpZD0zNDQmYW1vdW50PTIwMDAmY3VycmVuY3k9RVVSJmNvdW50cnk9TFQmdGVzdD0xJnZlcnNpb249MS42JnByb2plY3RpZD0xOTQxNzQmb3JpZ2luYWxfcGF5dGV4dD0mbGFuZz1lbmcmcGF5bWVudD13YWxsZXQmcGF5dGV4dD1PcmRlcitObyUzQSszNDQrYXQraHR0cCUzQSUyRiUyRmxvY2FsaG9zdCtwcm9qZWN0LislMjhTZWxsZXIlM0ErQWxpK05vbWFuJTI5JnBfZW1haWw9cmFraWI1MDkyJTQwZ21haWwuY29tJm1fcGF5X3Jlc3RvcmVkPTQyMjQ4MzM0OSZ0cmllZF9jaGFuZ2luZ19lbWFpbD0xJmZyYW1lPTAmc3RhdHVzPTEmcmVxdWVzdGlkPTQyMjQ4MzM0OSZuYW1lPU5hbWUmc3VyZW5hbWU9TGFzdCtuYW1lJnBheWFtb3VudD0yMDAwJnBheWN1cnJlbmN5PUVVUiZhY2NvdW50PVRFU1QxMjM0NTY3ODkw&ss1=c9175fa578e05b31849e280c1227563c&ss2=lL-vG923h4MBxjvHnym5gG_DXo1ZtBtoOXDPSzmjEL0sRqqKIWE12ApYIz2xY11k_TliDfPYtooVGyqTnn-bs026o28UjpEuBy8NPkzc4VJXvLuRB4kihjRjC4E4_zgjoIuycyTxf8h-oW5Q20uQtRDsj0uhq9X5E8etnVRXJTo%3D
                // WebToPayWallet.openDialog("paysera/payment-request.php?order_id=123&total=200");
              });
          })
          .catch(async (err) => {
            this.activeRealtime = true;
            console.log(err);
            await this.util.dismiss();
          });
      })
      .catch(async (err) => {
        console.log(err);
        await this.util.dismiss();
      });
  }

  // calculateFinal(sortedCartItems: SortedCartItems[]) {
  //   sortedCartItems.forEach((cartItem) => {
  //     cartItem.products.forEach(() => {});
  //   });
  // }

  async askPermissionForDelete(event, type: number = 1, index: number = 0) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Patvirtinkite!",
      message: "Ar tiktai norite ištrinti?",
      mode: "ios",
      buttons: [
        {
          text: "Atšaukti",
          handler: async () => {
            await this.alertController.dismiss();
          },
        },
        {
          text: "Ištrinti",
          cssClass: "delete",
          handler: async () => {
            if (type === 1) {
              await this.removeFromOrder(event, index);
            } else if (type === 2) {
              await this.removeProductFromOrder(event);
            }
            await this.alertController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  async removeFromOrder(cartItem: FinalSortedCartItem, index: number) {
    if (!cartItem.isCompleted && !cartItem.isPaid) {
      await this.firestore
        .collection(orders_user)
        .doc(cartItem.buyerUid)
        .collection(orders_user)
        .doc(cartItem.id)
        .delete()
        .then(async () => {
          this.finalUnPaidSortedItems.splice(index, 1);
          await this.util.showToast("Pašalintas! ", "success");
        })
        .catch(async (err) => {
          await this.util.showToast("Mėginkite dar kartą!", "warning");
        });
    }
  }

  async removeProductFromOrder({
    cartItem,
    prodIndex,
  }: {
    cartItem: FinalSortedCartItem;
    prodIndex: number;
  }) {
    const selectedProd = cartItem.products.splice(prodIndex, 1);
    cartItem.totalPrice -= +selectedProd[0].data.cart_price;

    await this.firestore
      .collection(orders_user)
      .doc(cartItem.buyerUid)
      .collection(orders_user)
      .doc(cartItem.id)
      .update({ ...cartItem, deliveryTypeDoc: null });
  }

  // onChangeType(i: number, type: Delivery) {
  //   this.finalUnPaidSortedItems[i].selectedDeliveryType = type;
  // }

  // showProduct(i: number) {
  //   this.activeCartItemNumber = i;
  // }

  // hideProduct(i: number) {
  //   this.activeCartItemNumber = undefined;
  // }

  onBack() {
    this.nav.navigateBack("purchase");
  }

  loadFinalOrderData(uid: string) {
    this.loadFinalOrderSubs = this.firestore
      .collection(orders_user)
      .doc(uid)
      .collection(orders_user, (ref) => ref.orderBy("timestamp", "desc"))
      .get()
      .pipe(
        map((actions) => {
          return actions.docs.map((a) => {
            let data: FinalSortedCartItemExtra =
              a.data() as FinalSortedCartItemExtra;
            data.shortNote = "";
            data.id = a.id;
            return data;
          });
        })
      )
      .subscribe((query) => {
        if (this.activeRealtime) {
          this.finalPaidSortedItems = [];
          this.finalUnPaidSortedItems = [];
          query.forEach((data) => {
            if (data.isCompleted && data.isPaid) {
              this.finalPaidSortedItems.push(data);
            } else {
              data.deliveryTypeDoc = this.firestore
                .collection(products)
                .doc(data.ownerUid);
              this.finalUnPaidSortedItems.push(data);
            }
          });
        }
        // console.log(this.finalUnPaidSortedItems.length);
        this.isLoaded = true;
      });
  }
}
