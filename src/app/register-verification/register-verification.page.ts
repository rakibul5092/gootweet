import { Component, OnInit } from "@angular/core";
import { LoginService } from "../services/login.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: "app-register-one",
  templateUrl: "./register-verification.page.html",
  styleUrls: ["./register-verification.page.scss"],
})
export class RegisterVerificationPage implements OnInit {
  constructor(private storage: LoginService, private util: UtilityService) {}

  ngOnInit() { }

  resendVerificationEmail() {
    this.storage.sendVerificationMail().then(() => {
      this.util.showToast("Email send successfully", "success");
    });
  }
}
