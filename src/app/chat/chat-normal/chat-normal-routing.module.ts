import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChatNormalPage } from "./chat-normal.page";

const routes: Routes = [
  {
    path: "",
    component: ChatNormalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatNormalPageRoutingModule {}
