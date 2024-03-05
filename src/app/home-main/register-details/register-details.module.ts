import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ImageCropperPopoverPageModule } from "src/app/components/popovers/image-cropper-popover/image-cropper-popover.module";
import { InputModule } from "src/app/components/utility-components/input-with-label/input.module";
import { SharedDirectiveModule } from "src/app/directives/shared-directive/shared-directive.module";
import { RegisterDetailsPageRoutingModule } from "./register-details-routing.module";
import { RegisterDetailsPage } from "./register-details.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterDetailsPageRoutingModule,
    ImageCropperPopoverPageModule,
    InputModule,
    SharedDirectiveModule,
  ],
  declarations: [RegisterDetailsPage],
})
export class RegisterFourPageModule {}
