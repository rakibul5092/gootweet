import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../services/login.service";
import { User } from "../models/user";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  onRegistrationForm: FormGroup;
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  matched: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private storage: LoginService,
    private firestore: AngularFirestore
  ) {}

  ionViewWillLeave() {
    const player = document.getElementById(
      "cloudinary-player"
    ) as HTMLVideoElement;
    if (player) {
      player.pause();
    }
  }

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
  resigtration() {
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
              this.navController.navigateForward([
                "register/register-verification",
              ]);
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
