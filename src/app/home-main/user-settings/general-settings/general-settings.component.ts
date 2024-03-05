import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
declare var google: any;
@Component({
  selector: "app-general-settings",
  templateUrl: "./general-settings.component.html",
  styleUrls: ["./general-settings.component.scss"],
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  public generalForms: FormGroup;
  private destroy$ = new Subject();
  enabled = false;
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private settingService: SettingsService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async ngOnInit() {
    this.initForm();
  }

  public async onSubmit() {
    this.enabled = false;
    const value = this.generalForms.value;
    this.settingService.me = {
      ...this.settingService.me,
      full_name: {
        first_name: value.first_name,
        last_name: value.last_name,
      },
      address: value.address,
      status: value.status,
      details: {
        ...this.settingService.me.details,
        address: value.address,
      },
    };
    await this.settingService.updateUserData();
  }

  addressChanged() {
    if (!this.generalForms.get("address").value.length) return;
    let inputBox = document
      .getElementById("googlePlaces")
      .getElementsByTagName("input")[0];
    let autoComplete = new google.maps.places.Autocomplete(inputBox, {
      type: "address",
    });
    autoComplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.generalForms
          .get("address")
          .setValue(autoComplete.getPlace().formatted_address);
      });
    });
  }

  private async initForm(): Promise<void> {
    const user = await this.settingService.initUser();
    this.generalForms = this.fb.group({
      first_name: [user.full_name.first_name || "", Validators.required],
      last_name: [user.full_name.last_name || "", Validators.required],
      email: [user.email || "", [Validators.required, Validators.email]],
      address: [user.details.address || "", Validators.required],
      status: [user.status || ""],
    });
    this.generalForms
      .get("address")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.length > 2) {
          this.addressChanged();
        }
      });

    this.generalForms.valueChanges.subscribe((res) => {
      this.enabled = true;
    });
  }
}
