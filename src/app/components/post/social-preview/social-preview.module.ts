import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SocialPreviewComponent } from "./social-preview.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgPipesModule } from "ngx-pipes";

@NgModule({
  declarations: [SocialPreviewComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, NgPipesModule],
  exports: [SocialPreviewComponent],
})
export class SocialPreviewModule {}
