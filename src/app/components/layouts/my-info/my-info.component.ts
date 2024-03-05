import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavigationExtras } from "@angular/router";
import {
  MenuController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { DynamicTitleService } from "src/app/services/dynamic-title.service";
import { getTimestamp } from "src/app/services/functions/functions";
import { MenuService } from "src/app/services/menu.service";
import { ChatsService } from "../../../chats/chats.service";
import { LIVE_STREAMINGS, NAVIGATION_TYPE } from "../../../constants";
import { User } from "../../../models/user";
import { WalletData } from "../../../models/wallet";
import { TermsConditionPage } from "../../../register/terms-condition/terms-condition.page";
import { LoginService } from "../../../services/login.service";
import { UtilityService } from "../../../services/utility.service";
import { WalletService } from "../../../services/wallet.service";
import { CartListPopupService } from "../../popovers/cart-list-popup/cart-list-popup.service";
import { ToastNotificationService } from "../../popovers/notifications/toast-notification/toast-notification.service";
import { ScreenService } from "src/app/services/screen.service";
import { GotoProfileService } from "src/app/services/goto-profile.service";
@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrls: ["./my-info.component.scss"],
})
export class MyInfoComponent implements OnInit, OnChanges {
  @Input() userTypeInNumber: BehaviorSubject<number>;
  @Input() createPost = false;
  @Input() wallet: WalletData;
  @Input() me: User;
  @Input() visible = false;
  @Output() activeType: EventEmitter<string> = new EventEmitter();
  isFirefox = false;
  public infoButtons = [
    {
      name: "Privatumo politika",
      icon: "documents-outline",
      path: "Privatumo",
      type: "",
    },
    {
      name: "Taisyklės",
      icon: "book-outline",
      path: "Taisyklės",
      type: "",
    },
    {
      name: "Kontaktai",
      icon: "mail-outline",
      path: "",
      type: "",
    },
  ];
  public businessButtons = [
    {
      name: "Distributorius",
      icon: "business-outline",
      path: "Distributorius",
      type: ["manufacturer", "user", "designer"],
    },
    {
      name: "Gamintojas",
      icon: "bar-chart-outline",
      path: "Gamintojas",
      type: ["manufacturer", "user", "designer"],
    },
    {
      name: "Konsultantas",
      icon: "accessibility-outline",
      path: "Konsultantas",
      type: ["manufacturer", "user", "designer"],
    },
  ];
  public normalButtons = [
    {
      name: "Nustatymai",
      icon: "settings-outline",
      path: "user-settings",
      type: ["manufacturer", "user", "designer"],
    },
    {
      name: "Mano sekėjai",
      icon: "people-circle-outline",
      path: "Sekėjai",
      type: ["manufacturer", "user", "designer"],
    },
    {
      name: "Piniginė",
      icon: "cash-outline",
      path: "wallet",
      type: ["manufacturer", "designer"],
    },

    {
      name: "Prekiu valdymas",
      icon: "add-circle-outline",
      path: "insert",
      type: ["manufacturer"],
    },
    {
      name: "Išsaugotos prekės",
      icon: "heart-outline",
      path: "reels",
      type: ["manufacturer", "user", "designer"],
    },
    {
      name: "Prikimų istorija",
      icon: "cart-outline",
      path: "reels",
      type: ["user"],
    },
    {
      name: "Pardavimų istorija",
      icon: "bag-check-outline",
      path: "reels",
      type: ["manufacturer", "designer"],
    },
    {
      name: "Desinger Dashboard",
      icon: "bag-check",
      path: "designer/video-call-dashboard",
      type: ["designer"],
    },
  ];

  constructor(
    private utilService: UtilityService,
    private navController: NavController,
    private storage: LoginService,
    private chatsService: ChatsService,
    private walletService: WalletService,
    private popoverController: PopoverController,
    public cartListPopup: CartListPopupService,
    private menuService: MenuService,
    private menuController: MenuController,
    private toastNotificationService: ToastNotificationService,
    private dynamicTitleService: DynamicTitleService,
    private screen: ScreenService,
    private gotoProfileService: GotoProfileService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.me && this.me) {
      this.filterButtons();
    }
  }

  public gotoProfile() {
    this.menuController?.close();
    if (this.me) {
      this.gotoProfileService.gotoProfile(this.me);
    } else {
      this.backToLogin();
    }
  }

  private filterButtons() {
    this.normalButtons = this.normalButtons.filter((button) => {
      if (button.type.includes(this.me.rule)) {
        return button;
      }
    });
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isFirefox =
        window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      this.me = await this.storage.getUser();
      if (this.me) {
        this.filterButtons();
      }
    }
    this.screen.onLogin.subscribe(async (value) => {
      this.me = await this.storage.getUser();
    });
  }

  liveInfo = {
    imageForView: null,
    imageFile: "",
    name: "",
  };

  private async gotoPurse() {
    if (!this.me) {
      this.backToLogin();
      return;
    }
    const flag = await this.walletService.checkWallet(this.me.uid);
    await this.utilService.dismiss();
    if (flag) {
      this.navController.navigateForward("purse");
    } else {
      let wallet: WalletData = {
        balance: 0,
        currency: "€",
      };
      if (this.me.uid) {
        await this.utilService.present("kuriant piniginė...");
        await this.walletService.generateWallet(this.me.uid, wallet);
        await this.utilService.dismiss();
        this.navController.navigateForward("purse");
      }
    }
  }

  public async logout() {
    this.menuController?.toggle();
    await this.utilService.present("Atsijungti...");
    this.chatsService.isSingleChat.next(false);
    this.chatsService.ngOnDestroy();
    this.dynamicTitleService.titleReset();
    await this.storage.signOut();
    this.toastNotificationService.setNotification(null);
    await this.utilService.dismiss();
    this.backToLogin();
  }
  private backToLogin() {
    this.navController.navigateRoot("login", {
      animated: true,
      animationDirection: "back",
    });
  }
  private navigate(url: string, type: string) {
    if (!this.me) {
      this.backToLogin();
      return;
    }
    if (this.menuController) {
      this.menuController.toggle();
    }
    if (type == NAVIGATION_TYPE.ROOT) this.navController.navigateRoot(url);
    else if (type == NAVIGATION_TYPE.FORWARD)
      this.navController.navigateForward(url, {
        animated: true,
        animationDirection: "forward",
      });
  }

  public onButtonClicked(button: any) {
    if (this.menuController) {
      this.menuController.toggle();
    }

    switch (button.path) {
      case "user-settings":
        this.navigate("user-settings", "forward");
        break;
      case "wallet":
        this.gotoPurse();
        break;
      case "Sekėjai":
        this.navigate("tracking-manufacturers", "forward");
        break;
      case "Pardavimų":
        this.navigate("/profile/manufacturer-order", "forward");
        break;
      case "Pirkinių":
        this.navigate("user-order", "forward");
        break;
      case "/profile/products":
        this.navigate(button.path, "forward");
        break;
      case "Privatumo":
        this.menuService.openTerms(1);
        break;
      case "Taisyklės":
        this.menuService.openTerms(1);
        break;
      case "reels":
        this.navigate("profile/my-reels/" + this.me.uid + "/reels", "forward");
        break;
      case "Distributorius":
        this.gotoInformation("manufacturer", "2");
        break;
      case "Gamintojas":
        this.gotoInformation("manufacturer", "2");
        break;
      case "Konsultantas":
        this.gotoInformation("designer", "1");
        break;
      case "categories":
        let url = "";
        if (this.screen.width.value < 768) {
          url = "filter/mobile-category";
        } else {
          url = "categories";
        }
        this.navigate(url, "forward");
        break;
      default:
        this.navigate(button.path, "forward");
    }
  }

  private gotoInformation(type: string, cat: string) {
    if (!this.me) {
      this.backToLogin();
      return;
    }
    let navExtra: NavigationExtras = {
      queryParams: {
        type: type,
        cat: cat,
      },
    };
    if (type === "designer") {
      this.navController.navigateForward(
        "designer/designer-register-details",
        navExtra
      );
    } else {
      this.navController.navigateForward("register-details", navExtra);
    }
  }
}
