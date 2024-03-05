import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ReelViewComponent } from "./reel-view.component";

const routes: Routes = [
  {
    path: "",
    component: ReelViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReelViewRoutingModule {}
