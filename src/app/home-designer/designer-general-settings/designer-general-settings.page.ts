import { Component, NgZone, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import * as auth from "firebase/auth";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { LoginService } from "src/app/services/login.service";
import { MessengerService } from "src/app/services/messenger.service";
import { users } from "../../constants";
import { Designer } from "../../models/user";
import { UtilityService } from "../../services/utility.service";

declare var google: any;

@Component({
  selector: "app-designer-general-settings",
  templateUrl: "./designer-general-settings.page.html",
  styleUrls: ["./designer-general-settings.page.scss"],
})
export class DesignerGeneralSettingsPage implements OnInit {
  isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  matched: boolean = true;
  isMessenger: boolean = false;
  settingTyepe = "general";
  designer;
  me: Designer = {
    activity: "",
    about: "",
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
    category: "",
    unread_message: null,
    details: null,
    status: "",
  };
  current_password: string;
  password: string;
  confirm_password: string;

  constructor(
    private firestore: AngularFirestore,
    private ngZone: NgZone,
    private nav: NavController,
    private util: UtilityService,
    private loadingController: LoadingController,
    private visible: VisibleService,
    private messengerService: MessengerService,
    private fireAuth: AngularFireAuth,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.getUser().then((user) => {
      if (user) {
        this.userType = user.rule;
        this.userTypeInNumber.next(
          this.userType === "manufacturer" ||
            this.userType === "retailchaincenter"
            ? 1
            : 2
        );
        this.isLoggedin.next(true);
        this.me = user as Designer;
        if (!this.visible.isLoaded) {
          this.messengerService.openMessenger(this.me);
          this.visible.isLoaded = true;
        }

        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query: any) => {
            if (query) {
              let data = query.data();
              if (user.rule === "designer") {
                this.me.address = data?.details?.address;
                this.me.profile_photo = data?.profile_photo;
                this.me.full_name = {
                  first_name: data?.full_name?.first_name,
                  last_name: data?.full_name?.last_name,
                };
              } else {
                this.nav.navigateForward("/");
              }
            }
          });
      } else {
        this.nav.navigateForward("/");
      }
    });
  }

  changeType(type) {
    this.settingTyepe = type;
  }

  async submitForm(form) {
    if (
      this.current_password != undefined &&
      this.current_password.trim() !== "" &&
      this.password != undefined &&
      this.password.trim() !== "" &&
      this.confirm_password != undefined &&
      this.confirm_password.trim() !== ""
    ) {
      if (this.password !== this.confirm_password) {
        this.util.showAlert("Slaptažodis", "Slaptažodžiai nesutampa!");
      } else {
        if (this.password.length < 6) {
          this.util.showAlert(
            "Slaptažodis",
            "Slapražodis turi susidėti iš didžiosios raides, skaičiaus ir teksto!"
          );
        } else {
          // check current user and update passord.
          const currentUser = auth.getAuth().currentUser;
          const credentials = auth.EmailAuthProvider.credential(
            currentUser.email,
            this.current_password
          );

          (await this.fireAuth.currentUser)
            .reauthenticateWithCredential(credentials)
            .then(async (success) => {
              this.util.present("Atnaujinta...");
              (await this.fireAuth.currentUser)
                .updatePassword(this.password)
                .then(() => {
                  this.firestore
                    .collection(users)
                    .doc(this.me.uid)
                    .update(this.me)
                    .then(() => {
                      this.util.dismiss().then(() => {
                        this.util.showAlert(
                          "Nustatymai",
                          "Nustatymai atnaujinti!"
                        );
                        this.password = undefined;
                        this.current_password = undefined;
                        this.confirm_password = undefined;
                      });
                    });
                })
                .catch((error) => {
                  this.util.showAlert("Slaptažodis", "Mėginkite dar kartą!");
                });
            })
            .catch((err) => {
              this.util.showAlert(
                "Slaptažodis",
                "Senas slaptažodis neatitinka!"
              );
              console.log("errror: ", err);
            });
        }
      }
    } else {
      if (form.dirty) {
        let loading = await this.loadingController.create({
          animated: true,
          message: "Updating",
        });
        await loading.present();

        this.firestore.collection(users).doc(this.me.uid).update(this.me);
        loading.dismiss();
        this.util.showAlert("Nustatymai", "Atnaujinta sėkmingai!");
      } else {
        this.util.showAlert("Informacija", "Jūs nieko neatnaujinote!");
      }
    }
  }

  onFocus(event) {
    event.srcElement.select();
  }

  addressChanged() {
    // console.log(this.address);
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
        // console.log(this.addressInput);
      });
    });
  }
}
