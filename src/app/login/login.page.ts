import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ResetPasswordPopupPage } from "../components/popovers/reset-password-popup/reset-password-popup.page";
import { ModalService } from "../services/modal.service";
import { ScreenService } from "../services/screen.service";
import { UserLoginService } from "./user-login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  onLoginForm: FormGroup;
  passType = "password";
  signInMethods$: Observable<any>;
  loading: Observable<boolean>;
  constructor(
    private formBuilder: FormBuilder,
    public userLoginService: UserLoginService,
    private modalService: ModalService,
    public screen: ScreenService
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
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
    this.signInMethods$ = this.userLoginService.signInMethods$;
    this.loading = this.userLoginService.loading.asObservable();
  }
  logIn() {
    const email = this.onLoginForm.value.email;
    const password = this.onLoginForm.value.password;
    if (email == "" || password == "" || !email || !password) {
      return;
    } else {
      this.userLoginService.logIn(email, password);
    }
  }
  async openResetPopover() {
    this.modalService.presentModal(
      ResetPasswordPopupPage,
      null,
      "reset-css",
      "ios"
    );
  }
}
