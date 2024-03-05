import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, PopoverController } from "@ionic/angular";
import { LoginService } from "../../services/login.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ScreenService } from "../../services/screen.service";
import { TermsConditionPage } from "../../register/terms-condition/terms-condition.page";
import { User } from "../../models/user";
import { UserLoginService } from "src/app/login/user-login.service";

@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.scss"],
})
export class UserRegisterComponent implements OnInit {
  onRegistrationForm: FormGroup;
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  matched: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private nav: NavController,
    private storage: LoginService,
    private firestore: AngularFirestore,
    private popoverController: PopoverController,
    private screen: ScreenService,
    public userLoginService: UserLoginService
  ) {}

  ngOnInit() {
    this.onRegistrationForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      confirm_password: [null, Validators.compose([Validators.required])],
      terms: [null, Validators.compose([Validators.required])],
    });
  }

  async openTerms() {
    let data = {
      type: 1,
    };
    const popover = await this.popoverController.create({
      component: TermsConditionPage,
      animated: true,
      componentProps: data,
      backdropDismiss: true,
      cssClass:
        this.screen.width.value > 767
          ? "api-instructions"
          : "api-instructions-mobile",
      keyboardClose: true,
      mode: "ios",
    });
    return await popover.present();
  }

  navback() {
    this.popoverController
      .dismiss()
      .then(() => {
        this.nav.navigateRoot("login");
      })
      .catch(() => {
        this.nav.navigateBack("login");
      });
  }

  //Registration function starts here
  registration() {
    const firstName = this.onRegistrationForm.value.firstName;
    const lastName = this.onRegistrationForm.value.lastName;
    const email = this.onRegistrationForm.value.email;
    const password = this.onRegistrationForm.value.password;
    const confirm_password = this.onRegistrationForm.value.confirm_password;
    const terms = this.onRegistrationForm.value.terms;
    if (email == "" || password == "" || !email || !password) {
      return;
    }
    if (password == confirm_password) {
      this.matched = true;
      if (terms) {
        this.notAccepted = false;
        const email = this.onRegistrationForm.value.email;
        const password = this.onRegistrationForm.value.password;
        this.storage.present("Creating account ...");

        this.storage
          .registerUser(email, password)
          .then((res: any) => {
            let user = res.user;
            this.registerDone(user, email, password, firstName, lastName);
          })
          .catch((error) => {
            this.storage.dismiss().then(() => {
              this.storage.presentAlert("Error!", error);
            });
          });
      } else {
        this.notAccepted = true;
      }
    } else {
      this.matched = false;
    }
  }

  registerDone(
    user: any,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      fb_id: "",
      google_id: "",
      full_name: {
        first_name: firstName,
        last_name: lastName,
      },
      address: "",
      phone: "",
      profile_photo: "",
      cover_photo: "",
      is_first_time: false,
      rule: "user",
      category: "",
      lastMessage: null,
      emailVerified: user.emailVerified,
      unread_message: 0,
      details: "",
      status: user?.status ? user.status : "",
    };
    this.storage.saveUnverifiedUser({ email: email, pass: password });
    this.firestore
      .collection("users")
      .doc(user.uid)
      .set(userData)
      .then((response) => {
        this.storage
          .sendVerificationMail()
          .then(() => {
            this.storage.dismiss().then(() => {
              this.nav.navigateForward(["register/register-verification"]);
            });
          })
          .catch((err) => {
            this.storage.dismiss().then(() => {
              this.storage.presentAlert("Error!", err);
            });
          });
      })
      .catch((err) => {
        this.storage.removeUser().then(() => {
          this.storage.removeUnverifiedUser();
        });
        this.storage.dismiss().then(() => {
          this.storage.presentAlert("Error!", err);
        });
      });
  }
}
