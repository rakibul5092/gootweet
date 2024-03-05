import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CreateLivePageRoutingModule } from "./create-live-routing.module";

import { CreateLivePage } from "./create-live.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateLivePageRoutingModule,
  ],
  declarations: [CreateLivePage],
})
export class CreateLivePageModule {}
