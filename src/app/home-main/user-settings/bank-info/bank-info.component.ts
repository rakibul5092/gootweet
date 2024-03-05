import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";

@Component({
  selector: "app-bank-info",
  templateUrl: "./bank-info.component.html",
  styleUrls: ["./bank-info.component.scss"],
})
export class BankInfoComponent implements OnInit {
  public bankForm: FormGroup;
  public testAccount = 1;
  enabled = true;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingsService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  get test() {
    return this.bankForm.controls.test;
  }

  public async onSubmit() {
    this.enabled = false;
    await this.settingService.updateBankInfo(this.bankForm.value);
  }

  onCheckChange(event) {
    this.bankForm.get("test").setValue(Number(event.detail.value));
  }

  private async buildForm(): Promise<void> {
    const bankInfo = await this.settingService.getBankInfo();
    this.testAccount = bankInfo?.test || 1;
    this.bankForm = this.fb.group({
      Bank_name: [bankInfo?.Bank_name || ""],
      account_no: [bankInfo?.account_no || ""],
      project_id: [bankInfo?.project_id || ""],
      password: [bankInfo?.password || ""],
      meta_tag: [bankInfo?.meta_tag || ""],
      test: [this.testAccount],
    });

    this.bankForm.valueChanges.subscribe((res) => {
      this.enabled = true;
    });
  }
}
