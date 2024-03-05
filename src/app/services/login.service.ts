import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import * as firebase from "firebase/auth";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { first } from "rxjs/operators";
import { AppComponent } from "../app.component";
import { VisibleService } from "../chat/chat-designer/visible.service";
import { users } from "../constants";
import { SortedCartItems } from "../models/product";
import { UnverifiedUser, User } from "../models/user";
const USER_INFO = "user";
const PURCHASE_USER_INFO = "purchase_user";
const USER_INFO_OUTSIDE = "user_outside";
const UNVERIFIED = "unverified-user";
@Injectable({
  providedIn: "root",
})
export class LoginService {
  userData: any;
  isLoading = false;
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  user: User;
  onLoggedout = new BehaviorSubject<boolean>(false);
  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private alertCtlr: AlertController,
    private nav: NavController,
    private visibility: VisibleService
  ) {}
  signInWithPhone(phoneNumber: string, recaptchaVerifier: any) {
    const phoneNumberString = "+" + phoneNumber;
    this.fireAuth
      .signInWithPhoneNumber(phoneNumberString, recaptchaVerifier)
      .then(async (confirmationResult) => {
        let prompt = await this.alertCtlr.create({
          header: "Patvirtinimo kodas",
          inputs: [
            { name: "confirmationCode", placeholder: "Patvirtinimo kodas" },
          ],
          buttons: [
            {
              text: "Nutarukti",
              handler: (data) => {},
            },
            {
              text: "Išsiūsta",
              handler: (data) => {
                confirmationResult
                  .confirm(data.confirmationCode)
                  .then(function (result) {
                    // User signed in successfully.
                    // ...
                  })
                  .catch(function (error) {});
              },
            },
          ],
        });
        await prompt.present();
      })
      .catch(function (error) {
        console.error("SMS not sent", error);
      });
  }

  async getOutSideUser() {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    const u = localStorage.getItem(USER_INFO_OUTSIDE);
    let user: User = JSON.parse(u);
    return user;
  }

  async saveOutsideUser(user: any) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(USER_INFO_OUTSIDE, JSON.stringify(user));
  }

  async getUser() {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    if (this.user) {
      return this.user;
    }
    let tempuser = await lastValueFrom(this.fireAuth.authState.pipe(first()));

    if (tempuser?.uid) {
      const doc = await lastValueFrom(
        this.fireStore.collection(users).doc(tempuser.uid).get().pipe(first())
      );
      if (doc.exists) {
        this.user = doc.data() as User;
      } else {
        this.user = {
          uid: tempuser.uid,
          email: tempuser.email,
          fb_id: "",
          google_id: "",
          full_name: {
            first_name: tempuser.displayName,
            last_name: "",
          },
          address: "",
          phone: "",
          profile_photo: tempuser.photoURL || "",
          cover_photo: "",
          rule: "user",
          category: "",
          is_first_time: true,
          lastMessage: null,
          emailVerified: true,
          unread_message: 0,
          details: "",
          status: "",
        };

        await this.fireStore.collection(users).doc(tempuser.uid).set(this.user);
      }

      this.saveUser(this.user);
      return this.user;
    } else {
      return null;
    }
  }

  async getUserFromLocal(): Promise<User> {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    return JSON.parse(localStorage.getItem(USER_INFO));
  }
  async saveUser(user: any) {
    if (user.rule === "designer") {
      this.visibility.isVisible.next(true);
    }
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(USER_INFO, JSON.stringify(user));
  }
  async savePurchaseUser(user: any) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(PURCHASE_USER_INFO, JSON.stringify(user));
  }

  async getPurchaseUser() {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    const u = localStorage.getItem(PURCHASE_USER_INFO);
    let user: User = JSON.parse(u) as User;
    return user;
  }

  async removeOutsideUser() {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.removeItem(USER_INFO_OUTSIDE);
  }

  async saveUnverifiedUser(user: UnverifiedUser) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(UNVERIFIED, JSON.stringify(user));
  }
  // Login in with email/password
  signIn(email: any, password: any) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }
  async facebookSignIn() {
    return await this.fireAuth.signInWithPopup(
      new firebase.FacebookAuthProvider()
    );
  }
  async gmailSignIn() {
    return await this.fireAuth.signInWithPopup(
      new firebase.GoogleAuthProvider()
    );
  }

  // Register user with email/password
  registerUser(email: any, password: any) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  // Email verification when new user register
  async sendVerificationMail() {
    return (await this.fireAuth.currentUser)
      .sendEmailVerification()
      .then(() => {
        // this.router.navigate(["verify-email"]);
      });
  }

  // Returns true when user is looged in
  async isLoggedIn() {
    if (!AppComponent.isBrowser.value) {
      return false;
    }
    const u = localStorage.getItem(USER_INFO);
    const user = JSON.parse(u);

    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Returns true when user's email is verified
  async isEmailVerified() {
    if (!AppComponent.isBrowser.value) {
      return false;
    }
    const u = localStorage.getItem(USER_INFO);
    const user = JSON.parse(u);
    return user.emailVerified !== false ? true : false;
  }

  // Store user in localStorage
  async setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      fb_id: "",
      google_id: "",
      full_name: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
      address: user.address,
      phone: user.phone,
      profile_photo: user.photo,
      cover_photo: user?.cover_photo,
      rule: "user",
      category: user?.category,
      lastMessage: null,
      is_first_time: user.is_first_time ? user.is_first_time : true,
      emailVerified: true,
      unread_message: 0,
      details: user?.details,
      status: user?.status ? user.status : "",
    };
    return await userRef.set(userData, {
      merge: true,
    });
  }
  // Sign-out
  async signOut() {
    return await this.fireAuth.signOut().then(() => {
      this.user = null;
      if (!AppComponent.isBrowser.value) {
        return;
      }
      localStorage.removeItem(USER_INFO);
      this.visibility.isVisible.next(false);
      this.isUserLoggedIn.next(false);
    });
  }
  async removeUser() {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.removeItem(USER_INFO);
    this.dismiss();
    this.visibility.isVisible.next(false);
    this.nav.navigateBack("register");
  }

  async removeUnverifiedUser() {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.removeItem(UNVERIFIED);
  }

  async present(message: any) {
    this.isLoading = true;
    let loading = await this.loadingController.create({
      animated: true,
      message: message,
      mode: "ios",
    });
    await loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 12000);
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      await this.loadingController
        .dismiss()
        .then(() => console.log("dismissed"));
    }
  }

  async presentAlert(header: any, message: any) {
    let alert = await this.alertCtlr.create({
      header: header,
      message: message,
      buttons: ["Dismiss"],
    });
    await alert.present();
  }

  async saveCartData(data: SortedCartItems[]) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem("cart", JSON.stringify(data));
  }

  async getCartData() {
    if (!AppComponent.isBrowser.value) {
      return null;
    }
    const cart = localStorage.getItem("cart");
    let data: SortedCartItems[] = JSON.parse(cart);
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  async getEmail() {
    if (!AppComponent.isBrowser.value) {
      return "";
    }
    let email = localStorage.getItem("Local_email");

    return email ? email : "";
  }

  async saveEmail(email: any) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem("Local_email", email);
  }
}
