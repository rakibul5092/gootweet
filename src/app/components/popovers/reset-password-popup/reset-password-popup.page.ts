import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ModalService } from "src/app/services/modal.service";

@Component({
  selector: "app-reset-password-popup",
  templateUrl: "./reset-password-popup.page.html",
  styleUrls: ["./reset-password-popup.page.scss"],
})
export class ResetPasswordPopupPage implements OnInit {
  email: string;
  isSuccess: boolean;
  status: string;
  constructor(
    private modalService: ModalService,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  send() {
    this.fireAuth
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this.isSuccess = true;
        this.status = "A password reset url sent to your email.";
      })
      .catch((err) => {
        this.isSuccess = false;
        console.log("Reset err:", err);
        this.status = err?.message;
      });
  }

  close() {
    this.modalService.dismiss();
  }
}
