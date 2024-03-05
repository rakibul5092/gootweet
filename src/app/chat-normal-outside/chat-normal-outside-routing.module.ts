import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChatNormalOutsidePage } from "./chat-normal-outside.page";

const routes: Routes = [
  {
    path: "",
    component: ChatNormalOutsidePage,
  },
  {
    path: "cart-popover",
    loadChildren: () =>
      import("./cart-popover/cart-popover.module").then(
        (m) => m.CartPopoverPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatNormalOutsidePageRoutingModule {}
