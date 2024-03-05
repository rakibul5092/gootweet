import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UserSettingsPageRoutingModule } from "./user-settings-routing.module";

import { UserSettingsPage } from "./user-settings.page";
import { SanitizeImagePipeModule } from "src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { InputFieldModule } from "src/app/components/utility-components/input-field/input-field.module";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { BankInfoComponent } from "./bank-info/bank-info.component";
import { LoginInfoComponent } from "./login-info/login-info.component";
import { ManufacturerInfoComponent } from "./manufacturer-info/manufacturer-info.component";
import { LoaderModule } from "src/app/components/utility-components/loader/loader.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserSettingsPageRoutingModule,
    SanitizeImagePipeModule,
    InputFieldModule,
    LoaderModule,
  ],
  declarations: [
    UserSettingsPage,
    GeneralSettingsComponent,
    BankInfoComponent,
    LoginInfoComponent,
    ManufacturerInfoComponent,
  ],
})
export class UserSettingsPageModule {}
