import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { MessengerService } from "src/app/services/messenger.service";
import { orders_designer, users } from "../../constants";
import { DesignerOrderItem } from "../../models/product";
import { User } from "../../models/user";
import { Transaction, TransactionData, WalletData } from "../../models/wallet";
import { getTimestamp, getUser } from "../../services/functions/functions";
import { GotoProfileService } from "../../services/goto-profile.service";
import { UtilityService } from "../../services/utility.service";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: "app-designer-wallet",
  templateUrl: "./designer-wallet.page.html",
  styleUrls: ["./designer-wallet.page.scss"],
})
export class DesignerWalletPage implements OnInit, OnDestroy {
  activeType: number = 1;
  cashoutAmount: number;
  me: User = {
    uid: "",
    email: "",
    fb_id: "",
    google_id: "",
    details: {
      address: "",
      areaOfActivity: "",
      bankAccount: "",
      bankName: "",
      brand_name: "",
      companyCode: "",
      companyName: "",
      email: "",
      individualPerson: true,
      legalPerson: true,
      name: "",
      profile_photo: "",
      pvmCode: "",
      sureName: "",
      telephone_no: "",
    },
    full_name: {
      first_name: "",
      last_name: "",
    },
    address: "",
    phone: "",
    profile_photo: "",
    cover_photo: "",
    rule: "",
    category: "",

    is_first_time: null,
    lastMessage: null,
    emailVerified: null,
    unread_message: null,
    status: "",
  };
  walletInfo: WalletData = {
    balance: 0,
    currency: "",
  };

  transactionInfo: Transaction[] = [];

  orders: DesignerOrderItem[] = [];
  designerProductSubs: Subscription;
  transSubs: Subscription;

  constructor(
    private util: UtilityService,
    private walletService: WalletService,
    private firestore: AngularFirestore,
    private visible: VisibleService,
    private messengerService: MessengerService,
    private gotoProfileService: GotoProfileService
  ) {}
  ngOnDestroy(): void {
    if (this.designerProductSubs) this.designerProductSubs.unsubscribe();
    if (this.transSubs) this.transSubs.unsubscribe();
  }

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        if (!this.visible.isLoaded) {
          this.messengerService.openMessenger(user);
          this.visible.isLoaded = true;
        }
        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            this.me = query.data() as User;

            this.walletService
              .getWalletData(this.me?.uid)
              .pipe(first())
              .subscribe((query1) => {
                this.walletInfo = query1.data() as WalletData;

                this.transSubs = this.walletService
                  .getWalletTransactions(this.me?.uid)
                  .subscribe((transQuery) => {
                    if (transQuery) {
                      this.transactionInfo = transQuery;
                    }
                  });
              });
          });
      }
    });
  }

  cashout() {
    if (this.me.rule === "designer") {
      if (this.walletInfo.balance >= 100) {
        this.util.present("Prašome palaukti...").then(() => {
          let transaction: Transaction = {
            amount: this.cashoutAmount,
            currency: "€",
            isCompleted: true,
            isCredit: false,
            isPaid: true,
            timestamp: getTimestamp(),
            type: "cashout",
          };
          this.walletService
            .cashout(this.me.uid, transaction)
            .then(async (query) => {
              await this.util.dismiss();
            })
            .catch(async (err) => {
              console.log(err);
              await this.util.dismiss();
              await this.util.showAlert("Error", err);
            });
        });
      }
    }
  }

  changeType(type) {
    this.activeType = type;
    if (this.activeType == 2) {
      this.getDesignerProduct();
    }
  }

  orderLoaded = false;
  getDesignerProduct() {
    this.designerProductSubs = this.firestore
      .collection(orders_designer)
      .doc(this.me.uid)
      .collection(orders_designer, (ref) => ref.orderBy("timestamp", "desc"))
      .snapshotChanges()
      .subscribe((query) => {
        this.orders = [];
        if (query.length > 0) {
          query.forEach((item) => {
            let order: DesignerOrderItem =
              item.payload.doc.data() as DesignerOrderItem;
            let commission: number = 0;
            order.products.forEach((item) => {
              commission = +commission + +item.designerCommission;
            });
            order.commission = commission;
            this.orders.push(order);
          });
        }
        this.orderLoaded = true;
      });
  }

  gotoProfile() {
    this.gotoProfileService.gotoProfile(this.me);
  }
}
