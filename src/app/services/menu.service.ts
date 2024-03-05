import { Injectable } from "@angular/core";
import { NavController, PopoverController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { User } from "../models/user";
import { WalletData } from "../models/wallet";
import { TermsConditionPage } from "../register/terms-condition/terms-condition.page";
import { WalletService } from "./wallet.service";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  me: User;
  isLoggedin = false;
  constructor(
    private nav: NavController,
    private walletService: WalletService,
    private popoverController: PopoverController
  ) {}
  walletInfo: WalletData = {
    balance: 0,
    currency: "",
  };

  onMenuBarClick(event: number) {
    const menuItems = Array.from(document.getElementsByClassName("menu-item"));
    if (menuItems && menuItems.length > 0) {
      menuItems.forEach((item) => {
        item.classList.remove("active");
      });
      menuItems[event].classList.add("active");
      localStorage.setItem("top-menu", event + "");
      const url =
        event === 0
          ? "/"
          : event === 1
          ? "/gootweet-tube"
          : event === 2
          ? "/categories"
          : "/reel-view?type=reels&index=0";
      this.nav.navigateRoot(url);
    }
  }

  init(user: User) {
    if (user) {
      this.me = user;
      this.isLoggedin = true;
      if (
        this.me.rule == "designer" ||
        this.me.rule == "manufacturer" ||
        this.me.rule == "retailchain"
      ) {
        this.walletService
          .getWalletData(this.me.uid)
          .pipe(first())
          .subscribe((query) => {
            this.walletInfo = query.data() as WalletData;
          });
      }
    } else {
      this.me = null;
      this.isLoggedin = false;
      // this.nav.navigateRoot("login");
    }
  }

  async openTerms(type) {
    let data = {
      type: type,
      isModal: true,
    };
    const popover = await this.popoverController.create({
      component: TermsConditionPage,
      animated: true,
      componentProps: data,
      backdropDismiss: true,
      cssClass: "api-instructions-mobile",
      keyboardClose: true,
      mode: "ios",
    });

    return await popover.present();
  }
}
