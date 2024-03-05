import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { getUser } from "src/app/services/functions/functions";
import { ScreenService } from "src/app/services/screen.service";
import { NotificationsPage } from "../../popovers/notifications/notifications.page";
import { BottomNavService } from "./bottom-nav.service";
import { Subscription } from "rxjs";
import { NewPostService } from "../../menu-items/home-item/new-post.service";
import { CartListPopupPage } from "../../popovers/cart-list-popup/cart-list-popup.page";
import { CartListPopupService } from "../../popovers/cart-list-popup/cart-list-popup.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-bottom-nav",
  templateUrl: "./bottom-nav.component.html",
  styleUrls: ["./bottom-nav.component.scss"],
})
export class BottomNavComponent implements OnInit, OnDestroy {
  me: User;
  isNotifiPopoverOpened = false;
  lastSelected = 0;
  tabs: Tab[];
  private tabSubs: Subscription;
  constructor(
    private nav: NavController,
    public screenService: ScreenService,
    private popoverController: PopoverController,
    private bottomNavService: BottomNavService,
    public newPostService: NewPostService,
    private router: Router,
    public cartListPopupService: CartListPopupService,
    private loginService: LoginService
  ) {}
  ngOnDestroy(): void {
    this.tabSubs?.unsubscribe();
    this.newPostService.onDestroy();
  }

  ngOnInit() {
    this.loginService.isUserLoggedIn.subscribe(async (res) => {
      await this.loginService.getUser().then((user) => {
        this.me = user;
      });
    });
    this.tabSubs = this.bottomNavService.getTabs().subscribe((res) => {
      this.tabs = res;
    });
    this.newPostService.initNewWallPost();
  }

  onClick(tab: any, index: number, event) {
    this.reset();
    if (tab.route === "notifications" && !this.isNotifiPopoverOpened) {
      this.openNotification(tab);
    } else if (tab.route === "home") {
      this.lastSelected = index;
      let currentRoute = this.router.url;
      this.nav.navigateRoot("/", {
        animated: true,
        animationDirection: "back",
      });
      if (currentRoute == "/") {
        window.location.reload();
        return;
      }
    } else if (tab.route === "cart") {
      this.openCartPopover(event);
    } else {
      this.lastSelected = index;
      this.nav.navigateForward(tab.route, {
        animated: true,
        animationDirection: "forward",
      });
    }

    tab.selected = true;
    // else if (tab.route === "people") {
    //   this.reset();
    //   this.onAllContacts();
    //   this.lastSelected = index;
    //   tab.selected = true;
    // }
  }

  reset() {
    this.tabs.forEach((item) => {
      item.selected = false;
    });
  }

  openCartPopover(event: any) {
    if (this.me) {
      this.cartListPopupService.openCartPopover(event);
    } else {
      this.nav.navigateForward("purchase");
    }
  }

  async openNotification(tab: any) {
    if (this.me) {
      this.isNotifiPopoverOpened = true;
      let notification = await this.popoverController.create({
        component: NotificationsPage,
        cssClass: "popover-notification",
        mode: "ios",
      });
      notification.onDidDismiss().then(() => {
        this.isNotifiPopoverOpened = false;
        this.reset();
        this.tabs[this.lastSelected].selected = true;
      });
      return await notification.present();
    } else {
      this.nav.navigateBack("login", {
        animated: true,
        animationDirection: "back",
      });
    }
  }
}
