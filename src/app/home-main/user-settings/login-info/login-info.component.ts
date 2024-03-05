import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";

@Component({
  selector: "app-login-info",
  templateUrl: "./login-info.component.html",
  styleUrls: ["./login-info.component.scss"],
})
export class LoginInfoComponent implements OnInit {
  loginForm: FormGroup;
  currentPasswordVisibility = false;
  newPasswordVisibility = false;
  confirmPasswordVisibility = false;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingsService
  ) {}

  get newPassword() {
    return this.loginForm.controls.newPassword;
  }
  get confirmPassword() {
    return this.loginForm.controls.confirmPassword;
  }

  ngOnInit() {
    this.loginForm = this.buildForm();
  }

  public async onSubmit() {
    await this.settingService.updatePassword(
      this.loginForm.get("currentPassword").value,
      this.loginForm.get("newPassword").value
    );
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      currentPassword: ["", [Validators.required, Validators.minLength(6)]],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    });
  }
}
