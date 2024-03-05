import { Component, OnInit } from "@angular/core";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { MenuService } from "src/app/services/menu.service";
import { CartListPopupService } from "src/app/components/popovers/cart-list-popup/cart-list-popup.service";
import { MenuController } from "@ionic/angular";

@Component({
  selector: "app-user-mobile-menu",
  templateUrl: "./user-mobile-menu.page.html",
  styleUrls: ["./user-mobile-menu.page.scss"],
})
export class UserMobileMenuPage implements OnInit {
  constructor(
    public visibility: VisibleService,
    public menuService: MenuService,
    public cartListPopup: CartListPopupService,
    public menuController: MenuController
  ) {}

  ngOnInit() {}
}
