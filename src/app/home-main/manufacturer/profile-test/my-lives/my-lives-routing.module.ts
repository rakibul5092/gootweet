import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyLivesPage } from "./my-lives.page";

const routes: Routes = [
  {
    path: "",
    component: MyLivesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLivesPageRoutingModule {}
