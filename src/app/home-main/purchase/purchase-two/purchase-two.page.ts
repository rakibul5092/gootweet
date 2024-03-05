import { HttpClient } from "@angular/common/http";
import { Component, NgZone, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { orders_user, users } from "../../../constants";
import { FinalSortedCartItem, SortedCartItems } from "../../../models/product";
import { UserInforForPurchase } from "../../../models/user";
import { PurchaseService } from "../../purchase/purchase.service";
import { UtilityService } from "../../../services/utility.service";
import { generatePassword } from "../../../services/functions/wall_post_functions";
import { first } from "rxjs/operators";
import { LoginService } from "src/app/services/login.service";

declare var google: any;
@Component({
  selector: "app-purchase-two",
  templateUrl: "./purchase-two.page.html",
  styleUrls: ["./purchase-two.page.scss"],
})
export class PurchaseTwoPage implements OnInit {
  me: UserInforForPurchase = {
    address: "",
    email: "",
    uid: "",
    emailVerified: null,
    fb_id: "",
    full_name: {
      first_name: "",
      last_name: "",
    },
    google_id: "",
    is_first_time: null,
    lastMessage: null,
    phone: "",
    profile_photo: "",
    cover_photo: "",
    rule: "",
    unread_message: null,
    details: {
      telephone_no: "",
    },
    city: "",
    postal_code: "",
    house_number: "",
    flat_number: "",
    category: "",
    status: "",
  };
  uid: string;
  isLoggedIn = true;
  checked = false;

  constructor(
    private nav: NavController,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private util: UtilityService,
    private fireAuth: AngularFireAuth,
    private http: HttpClient,
    private service: PurchaseService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.uid) {
        this.uid = params.uid;
        this.isLoggedIn = false;
      } else {
        this.loginService.getUser().then((user: UserInforForPurchase) => {
          if (user) {
            this.firestore
              .collection(users)
              .doc(user.uid)
              .get()
              .pipe(first())
              .subscribe((query) => {
                let tempUser: UserInforForPurchase =
                  query.data() as UserInforForPurchase;
                this.me = {
                  address: tempUser.address,
                  category: tempUser.category ? tempUser.category : "",
                  city: tempUser.city,
                  flat_number: tempUser?.flat_number
                    ? tempUser?.flat_number
                    : "",
                  house_number: tempUser?.house_number
                    ? tempUser?.house_number
                    : "",
                  cover_photo: tempUser.cover_photo,
                  details: {
                    telephone_no: tempUser?.details?.telephone_no
                      ? tempUser?.details?.telephone_no
                      : "",
                  },
                  email: tempUser.email,
                  emailVerified: tempUser.emailVerified,
                  fb_id: tempUser.fb_id,
                  full_name: tempUser.full_name,
                  google_id: tempUser.google_id,
                  is_first_time: tempUser.is_first_time,
                  lastMessage: tempUser.lastMessage,
                  phone: tempUser.phone,
                  postal_code: tempUser.postal_code,
                  profile_photo: tempUser.profile_photo,
                  rule: tempUser.rule,
                  uid: tempUser.uid,
                  unread_message: tempUser.unread_message,
                  status: tempUser?.status ? tempUser.status : "",
                };

                if (query.id != "") {
                  this.isLoggedIn = true;
                }
              });
          } else {
            this.isLoggedIn = false;
          }
        });
      }
    });
  }

  nextPage() {
    if (this.isLoggedIn) {
      if (
        this.me.address != "" &&
        this.me.city &&
        this.me.city != "" &&
        this.me.details.telephone_no &&
        this.me.details.telephone_no != "" &&
        this.me.email != "" &&
        this.me.full_name.first_name != "" &&
        this.me.full_name.last_name != "" &&
        this.me.postal_code &&
        this.me.postal_code != "" &&
        this.me.house_number &&
        this.me.house_number != ""
      ) {
        this.checked = false;
        if (this.uid) {
          let navExtra: NavigationExtras = {
            queryParams: {
              uid: this.uid,
            },
          };
          this.nav.navigateForward("purchase/payment", navExtra);
        } else {
          if (this.me) {
            this.nav.navigateForward("purchase/payment");
          }
        }
      } else {
        this.checked = true;
        this.showWarning();
      }
    }
  }

  async submitForm() {
    if (
      this.me.address != "" &&
      this.me.city &&
      this.me.city != "" &&
      this.me.details.telephone_no &&
      this.me.details.telephone_no != "" &&
      this.me.email != "" &&
      this.me.full_name.first_name != "" &&
      this.me.full_name.last_name != "" &&
      this.me.postal_code &&
      this.me.postal_code != "" &&
      this.me.house_number &&
      this.me.house_number != ""
    ) {
      if (this.isLoggedIn) {
        let loading = await this.loadingController.create({
          animated: true,
          message: "Atnaujinama",
          mode: "ios",
        });
        await loading.present();

        this.firestore
          .collection(users)
          .doc(this.me.uid)
          .set(this.me, { merge: true })
          .then(() => {
            loading.dismiss().then(() => {
              if (this.uid) {
                let navExtra: NavigationExtras = {
                  queryParams: {
                    uid: this.uid,
                  },
                };
                this.nav.navigateForward("purchase/payment", navExtra);
              } else {
                this.nav.navigateForward("purchase/payment");
              }
            });
          });
      } else {
        this.registerAsUser();
      }
    } else {
      this.checked = true;
      this.showWarning();
    }
  }

  registerAsUser() {
    this.util.present("Prašome palaukti...").then(() => {
      let pass = generatePassword(8);
      this.util.setLoadingText("Prisijungiama kaip vartotojas...");
      this.fireAuth
        .createUserWithEmailAndPassword(this.me.email, pass)
        .then((res) => {
          this.util.setLoadingText(
            "Prisijungimo informacija išsiūsta į el. paštą..."
          );
          let postData = new FormData();
          postData.append("email", this.me?.email);
          postData.append("first_name", this.me?.full_name?.first_name);
          postData.append("last_name", this.me?.full_name?.last_name);
          postData.append("pass", pass);

          this.http
            .post("https://api.gootweet.com/email.php", postData)
            .pipe(first())
            .subscribe(() => {
              this.util.setLoadingText("Informacija saugoma...");
              let user = res.user;
              this.me.uid = res.user.uid;
              this.firestore
                .collection("users")
                .doc(user.uid)
                .set(this.me, { merge: true })
                .then((response) => {
                  this.gotoPurchaseForNewUser(this.me);
                })
                .catch((err) => {
                  this.util.dismiss().then(() => {
                    this.util.showAlert("Klaida!", err);
                  });
                });
            });
        })
        .catch((err) => {
          let errCode = err.code;
          if (errCode === "auth/email-already-in-use") {
            this.firestore
              .collection("users", (ref) =>
                ref.where("email", "==", this.me.email)
              )
              .get()
              .pipe(first())
              .subscribe((uQuery) => {
                uQuery.forEach((items) => {
                  let user: UserInforForPurchase =
                    items.data() as UserInforForPurchase;

                  this.gotoPurchaseForNewUser(user);
                });
              });
          } else {
            this.util.dismiss().then(() => {
              this.util.showAlert("Klaida", err);
            });
          }
        });
    });
  }

  finalSortedItems: FinalSortedCartItem[] = [];
  gotoPurchaseForNewUser(me: UserInforForPurchase) {
    this.uid = me.uid;
    this.service
      .getLocalSortedItems()
      .then((sortedItems: SortedCartItems[]) => {
        this.service.getFinalSortedCartItems(
          sortedItems,
          me.uid,
          this.finalSortedItems,
          me,
          me.uid
        );
      });
  }

  onFocus(event) {
    event.srcElement.select();
  }

  addressChanged() {
    if (!this.me.address.trim().length) return;
    let inputBox = document
      .getElementById("googlePlaces")
      .getElementsByTagName("input")[0];
    let autoComplete = new google.maps.places.Autocomplete(inputBox, {
      type: "address",
    });
    autoComplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.me.address = autoComplete.getPlace().formatted_address;
      });
    });
  }

  async showWarning() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Iveskite visus laukelius!!!",
      message: "Patikrinkite laukelius...",
      mode: "ios",
      buttons: [
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });
    alert.present();
  }

  deleteUnpaidUserOrder() {
    this.firestore
      .collection(orders_user)
      .doc(this.me.uid)
      .collection(orders_user, (ref) =>
        ref.where("isCompleted", "==", false).where("isPaid", "==", false)
      )
      .get()
      .pipe(first())
      .subscribe((res) => {
        res.forEach((item) => {
          item.ref.delete();
        });
      });
  }

  onBack() {
    if (this.me && this.me.uid && this.me.uid != "") {
      this.deleteUnpaidUserOrder();
    }
    this.nav.navigateBack("purchase", {
      animated: true,
      animationDirection: "back",
    });
  }
}
