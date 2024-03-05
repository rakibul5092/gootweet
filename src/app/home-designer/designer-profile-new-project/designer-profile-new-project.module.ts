import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DesignerProfileNewProjectPageRoutingModule } from "./designer-profile-new-project-routing.module";
import { DesignerProfileNewProjectPage } from "./designer-profile-new-project.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerProfileNewProjectPageRoutingModule,
  ],
  declarations: [DesignerProfileNewProjectPage],
})
export class DesignerProfileNewProjectPageModule {}
