import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ImageCropperModule } from "ngx-image-cropper";
import { DesignerRegisterDetailsPageRoutingModule } from "./designer-register-details-routing.module";
import { DesignerRegisterDetailsPage } from "./designer-register-details.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerRegisterDetailsPageRoutingModule,
    ReactiveFormsModule,
    ImageCropperModule,
  ],
  declarations: [DesignerRegisterDetailsPage],
})
export class DesignerRegisterDetailsPageModule {}
