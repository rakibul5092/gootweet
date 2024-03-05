import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import * as firebase from "firebase/auth";
import { NgOneTapService } from "ng-google-one-tap";
import { BehaviorSubject } from "rxjs";
import { ToastNotificationService } from "../components/popovers/notifications/toast-notification/toast-notification.service";
import { facebookToken, users, wallet } from "../constants";
import { User } from "../models/user";
import { LoginService } from "../services/login.service";
import { ScreenService } from "../services/screen.service";
import { UtilityService } from "../services/utility.service";
import { WalletService } from "../services/wallet.service";
@Injectable({
  providedIn: "root",
})
export class UserLoginService {
  providers: any;
  signInMethods$ = new BehaviorSubject([]);
  disabled = false;
  loading = new BehaviorSubject(false);
  constructor(
    private loginService: LoginService,
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private walletService: WalletService,
    private navController: NavController,
    private util: UtilityService,
    private screen: ScreenService,
    @Inject(PLATFORM_ID) private platformId,
    private onetap: NgOneTapService,
    private router: Router,
    private toasterService: ToastNotificationService
  ) {
    if (isPlatformBrowser(platformId)) {
      setTimeout(() => {
        this.providers = {
          facebook: new firebase.FacebookAuthProvider(),
          google: new firebase.GoogleAuthProvider(),
          apple: new firebase.TwitterAuthProvider(),
        };
      }, 1000);
    }
  }

  init() {
    this.fireAuth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.onetap?.cancelTheTap();
        } else {
          this.onetap?.tapInitialize(); //Initialize OneTap, At intial time you can pass config  like this.onetap.tapInitialize(conif) here config is optional.
          this.onetap.promtMoment.subscribe(
            (res) => {
              // Subscribe the Tap Moment. following response options all have self explanatory. If you want more info pls refer official document below attached link.
              res.getDismissedReason();
              res.getMomentType();
              res.getNotDisplayedReason();
              res.getSkippedReason();
              res.isDismissedMoment();
              res.isDisplayed();
              res.isNotDisplayed();
              res.isSkippedMoment();
            },
            (err) => {}
          );
          this.onetap.oneTapCredentialResponse.subscribe(
            async (res) => {
              // After continue with one tap JWT credentials response.
              await this.handle(res);
            },
            (err) => {}
          );
        }
      },
      (err) => console.log(err)
    );
  }

  async handle(token: any) {
    this.disabled = true;
    this.loading.next(true);
    const credential = firebase.GoogleAuthProvider.credential(token.credential);
    const res = await this.fireAuth.signInWithCredential(credential);
    let user = {
      profile_photo: res.user.photoURL,
      uid: res.user.uid,
      full_name: {
        first_name: res.user.displayName,
        last_name: "",
      },
      emailVerified: true,
      email: res.user.email,
    };
    if (res.additionalUserInfo.isNewUser) {
      await this.addIfNotAvailable(user);
    } else {
      await this.checkLoginInfo(user);
    }
  }

  async loginWithFacebook() {
    this.disabled = true;
    await this.loginService
      .facebookSignIn()
      .then(async (res: any) => {
        this.loading.next(true);
        await this.initFbLoginData(res);
      })
      .catch(async (err) => {
        if (err.code === "auth/account-exists-with-different-credential") {
          this.loading.next(true);
          const existingEmail = err.email;
          const pendingCred = err.credential;
          const methods = await this.fireAuth.fetchSignInMethodsForEmail(
            existingEmail
          );
          let cred = null;
          if (methods.indexOf(firebase.GoogleAuthProvider.PROVIDER_ID) !== -1) {
            const gProvider = new firebase.GoogleAuthProvider();
            gProvider.setCustomParameters({ login_hint: existingEmail });
            cred = await this.fireAuth.signInWithPopup(gProvider);
            await cred.user.linkWithCredential(pendingCred);
          } else if (
            methods.indexOf(firebase.EmailAuthProvider.PROVIDER_ID) !== -1
          ) {
            const password = window.prompt(
              "Please provide the password for " + existingEmail
            );
            cred = await this.fireAuth.signInWithEmailAndPassword(
              existingEmail,
              password
            );
            await cred.user.linkWithCredential(pendingCred);
          }
          if (cred) {
            await this.initFbLoginData(cred);
          } else {
            this.loading.next(false);
            await this.util.showAlert("Error", err.message);
          }
        }

        this.disabled = false;
      });
  }

  async initFbLoginData(res) {
    let user = {
      profile_photo:
        res.additionalUserInfo?.profile?.picture?.data?.url ||
        res?.user?.photoURL,
      uid: res.user.uid,
      displayName: res.user.displayName,
      emailVerified: true,
      email: res.user.email,
    };
    localStorage.setItem(facebookToken, res.credential.accessToken);

    if (res.additionalUserInfo.isNewUser) {
      await this.addIfNotAvailable(user);
    } else {
      await this.checkLoginInfo(user);
    }
  }

  async loginWithGmail() {
    this.disabled = true;
    const res = await this.loginService.gmailSignIn();
    this.loading.next(true);
    let user = {
      profile_photo: res.user.photoURL,
      uid: res.user.uid,
      full_name: {
        first_name: res.user.displayName,
        last_name: "",
      },
      emailVerified: true,
      email: res.user.email,
    };
    if (res.additionalUserInfo.isNewUser) {
      await this.addIfNotAvailable(user);
    } else {
      await this.checkLoginInfo(user);
    }
  }

  async logIn(email: string, password: string) {
    this.disabled = true;
    await this.loginService
      .signIn(email, password)
      .then((res) => {
        this.loading.next(true);
        let user = res.user;
        this.checkLoginInfo(user);
      })
      .catch(async (error) => {
        this.loading.next(false);
        await this.loginService.presentAlert("Login error!", error);
        this.disabled = false;
      });
  }
  async addIfNotAvailable(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      fb_id: "",
      google_id: "",
      full_name: {
        first_name: user?.full_name?.first_name || "",
        last_name: user?.full_name?.last_name || "",
      },
      address: "",
      phone: "",
      profile_photo:
        user.profile_photo &&
        user.profile_photo !== "" &&
        !(
          user.profile_photo.includes("platform-lookaside.fbsbx.com") ||
          user.profile_photo.includes("google")
        )
          ? user.profile_photo
          : user?.profile_photo,
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
    await this.firestore
      .collection(users)
      .doc(userData.uid)
      .set(userData, { merge: true });
    this.setUser(userData);
  }
  async checkLoginInfo(loggedInUser: any) {
    if (loggedInUser.emailVerified) {
      this.setUser(loggedInUser);
    } else {
      this.loading.next(false);
      this.navController.navigateRoot("register/register-verification");
      this.disabled = false;
    }
  }

  async setUser(loggedInUser: any) {
    this.toasterService.setNotification(null);
    this.loginService.isUserLoggedIn.next(true);
    if (loggedInUser.email == "furniin.mail@gmail.com") {
      this.navController.navigateRoot("admin/admin-categories", {
        animated: true,
        animationDirection: "forward",
      });
    } else {
      if (this.router.url === "/login") {
        this.navController.navigateRoot("/", {
          animated: true,
          animationDirection: "forward",
        });
      } else {
        window.location.reload();
      }
    }
    this.loading.next(false);
    this.disabled = false;
    this.screen.onLogin.next(true);
  }
}
