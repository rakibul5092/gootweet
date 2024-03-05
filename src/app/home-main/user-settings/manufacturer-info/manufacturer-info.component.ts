import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";

@Component({
  selector: "app-manufacturer-info",
  templateUrl: "./manufacturer-info.component.html",
  styleUrls: ["./manufacturer-info.component.scss"],
})
export class ManufacturerInfoComponent implements OnInit {
  public manufacturerForm: FormGroup;
  enabled = true;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingsService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  public async onSubmit() {
    this.enabled = false;
    const value = this.manufacturerForm.value;
    this.settingService.me.details = {
      ...this.settingService.me.details,
      ...value,
    };

    // await this.settingService.updateUserData();
  }

  private async buildForm(): Promise<void> {
    const user = await this.settingService.initUser();
    this.manufacturerForm = this.fb.group({
      brand_name: [user?.details?.brand_name || "", Validators.required],
      company_name: [user?.details?.company_name || "", Validators.required],
      company_code: [user?.details?.company_code || "", Validators.required],
      pvm_code: [user?.details?.pvm_code || "", Validators.required],
      telephone_no: [user?.details?.telephone_no || "", [Validators.required]],
      email: [user?.email || "", [Validators.required, Validators.email]],
    });

    this.manufacturerForm.valueChanges.subscribe((res) => {
      this.enabled = true;
    });
  }
}
