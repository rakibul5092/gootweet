import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRoute } from "@angular/router";
import { LoginService } from "../services/login.service";
import { UnverifiedUser, User } from "../models/user";
import { AngularFirestore } from "@angular/fire/compat/firestore";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "../services/utility.service";
import { AppComponent } from "../app.component";
import { first } from "rxjs/operators";

const UNVERIFIED = "unverified-user";
@Component({
  selector: "app-register-verified",
  templateUrl: "./register-verified.page.html",
  styleUrls: ["./register-verified.page.scss"],
})
export class RegisterVerifiedPage implements OnInit {
  message: string;
  loginButton = false;
  resend = false;
  email: string;
  url: string;
  mode: string;
  code: string;
  onLoginForm: FormGroup;

  constructor(
    private nav: NavController,
    private angularFireAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private storage: LoginService,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private utils: UtilityService
  ) {}

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required])],
      confirm: [null, Validators.compose([Validators.required])],
    });
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.oobCode && params.mode) {
        this.mode = params.mode;
        if (params.mode === "resetPassword") {
          this.angularFireAuth
            .verifyPasswordResetCode(params.oobCode)
            .then(() => {
              this.code = params.oobCode;
            })
            .catch(() => {
              this.utils.showToast("Invalid code", "danger");
            });
        } else {
          this.angularFireAuth
            .applyActionCode(params.oobCode)
            .then((res) => {
              this.autoLogin();
              this.message =
                "Jūsų el. Pašto adresas patvirtintas. Nori prisijungti?";
              this.loginButton = true;
              this.resend = false;
            })
            .catch((err) => {
              this.message =
                "Prašome dar kartą registruotis, kad patvirtintumėte!";
              this.loginButton = false;
              this.resend = true;
            });
        }
      }
    });
  }

  resetPassword() {
    const password = this.onLoginForm.value.password;
    const confirm = this.onLoginForm.value.confirm;
    if (password === confirm && this.code && this.mode) {
      this.angularFireAuth
        .confirmPasswordReset(this.code, password)
        .then(() => {
          this.utils.showToast("Password changed", "success").then(() => {
            this.nav.navigateRoot("login");
          });
        });
    } else {
      this.utils.showToast("Password not matched!", "danger");
    }
  }

  autoLogin() {
    this.getUnverifiedUser().then((user: UnverifiedUser) => {
      if (user) {
        let email = user.email;
        let pass = user.pass;
        if (email && email.trim() !== "" && pass && pass.trim() !== "") {
          this.storage.present("Singing in...");
          this.storage
            .signIn(email, pass)
            .then((res: any) => {
              let user = res.user;

              if (user.emailVerified) {
                this.firestore
                  .collection("users")
                  .doc(user.uid)
                  .ref.get()
                  .then((snapshot) => {
                    this.setUser(snapshot.data(), snapshot.id);
                  });
              } else {
                this.storage.dismiss().then(() => {
                  this.nav.navigateRoot("register/register-verification");
                  return false;
                });
              }
            })
            .catch((error) => {
              this.storage.dismiss().then(() => {
                this.storage.presentAlert("Login error!", error);
              });
            });
        }
      }
    });
  }

  async getUnverifiedUser() {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    return JSON.parse(localStorage.getItem(UNVERIFIED));
  }
  gotoLogin() {
    this.nav.navigateRoot("login");
  }
  resendEmail() {
    this.nav.navigateForward("register");
  }

  setUser(user: any, uid: any) {
    const userData: User = {
      uid: uid,
      email: user.email,
      fb_id: "",
      google_id: "",
      full_name: {
        first_name: user?.full_name?.first_name,
        last_name: user?.full_name?.last_name,
      },
      address: "",
      phone: "",
      profile_photo: user?.profile_photo,
      cover_photo: "",
      rule: user.rule ? user.rule : "user",
      category: user?.category,
      is_first_time: false,
      lastMessage: user.lastMessage,
      emailVerified: true,
      unread_message: user?.unread_message ? user?.unread_message : 0,
      details: user?.details,
      status: user?.status ? user.status : "",
    };

    this.firestore
      .collection("users")
      .doc(uid)
      .update({ is_first_time: false, rule: "user", emailVerified: true })
      .then((res) => {
        this.storage
          .saveUser(userData)
          .then(() => {
            this.storage.dismiss().then(() => {
              if (userData.rule === "designer") {
                this.nav.navigateRoot("/");
              } else {
                this.nav.navigateRoot("/");
              }
            });
          })
          .catch(() => {
            this.storage.dismiss().then(() => {
              this.nav.navigateRoot("login");
            });
          });
      });
  }
}
