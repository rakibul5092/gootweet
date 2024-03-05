import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController } from "@ionic/angular";
import algoliaserch, { SearchClient } from "algoliasearch";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { ChangeOnscrollService } from "src/app/services/change-onscroll.service";
import { DynamicTitleService } from "src/app/services/dynamic-title.service";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { MenuService } from "src/app/services/menu.service";
import { ScreenService } from "src/app/services/screen.service";
import { environment } from "../../../../environments/environment";
import { ChatService } from "../../../chat/chat-designer/chat.service";
import { ChatsService } from "../../../chats/chats.service";
import { NAVIGATION_TYPE } from "../../../constants";
import { SelectiveLoadingStrategy } from "../../../custom-preload-strategy";
import { User } from "../../../models/user";
import { LoginService } from "../../../services/login.service";
import { NotificationsService } from "../../popovers/notifications/notifications.service";
import { ToastNotificationService } from "../../popovers/notifications/toast-notification/toast-notification.service";
import { HeaderService } from "./header.service";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.page.html",
  styleUrls: ["./header.page.scss"],
})
export class HeaderPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("header") public header: ElementRef;
  @Output() checkIsAdminEvent: EventEmitter<boolean> = new EventEmitter();
  isLoggedIn = false;
  userType: string;
  me: User;
  newMessageCount = 0;
  newNotification = 0;
  cartItems = [];

  searchText = "";
  client: SearchClient;
  searchConfig = {
    ...environment.algolia,
    indexName: "categories",
  };
  showResult = false;
  searchResult = [];
  sResult = [];

  // searchHide = false;
  categoryVisible = false;
  screenWidth = 0;

  chatCountSubs: any;
  screenSubs: any;
  notificationCountSubs: any;
  screenOnLoginSubs: any;
  changeCatSubs: any;
  isUserLoggedInSubs: any;
  searchHideSubs: any;
  newWallsubs: any;
  firstTimeLoaded = 0;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private navController: NavController,
    public headerService: HeaderService,
    private chatsService: ChatsService,
    public chatService: ChatService,
    private searchPopupService: SearchPopupService,
    private strategy: SelectiveLoadingStrategy,
    public gotoProfileService: GotoProfileService,
    public screen: ScreenService,
    private changeOnScrollService: ChangeOnscrollService,
    private menuController: MenuController,
    @Inject(PLATFORM_ID) private platformId: any,
    private visibleService: VisibleService,
    private notificationService: NotificationsService,
    private toastNotificationService: ToastNotificationService,
    private dynamicTitleService: DynamicTitleService,
    public menuService: MenuService
  ) {}
  ngAfterViewInit(): void {
    const menuItems = Array.from(document.getElementsByClassName("menu-item"));
    if (menuItems && menuItems.length > 0) {
      const menuIndex =
        (localStorage.getItem("top-menu") as unknown as number) || 0;
      menuItems[menuIndex].classList.add("active");
    }
  }
  ngOnDestroy(): void {
    if (this.chatCountSubs) this.chatCountSubs.unsubscribe();
    if (this.screenSubs) this.screenSubs.unsubscribe();
    if (this.notificationCountSubs) this.notificationCountSubs.unsubscribe();
    if (this.screenOnLoginSubs) this.screenOnLoginSubs.unsubscribe();
    if (this.changeCatSubs) this.changeCatSubs.unsubscribe();
    if (this.isUserLoggedInSubs) this.isUserLoggedInSubs.unsubscribe();
    // if (this.searchHideSubs) this.searchHideSubs.unsubscribe();
    this.firstTimeLoaded = 0;
    this.newMessageCount = 0;
    if (this.newWallsubs) this.newWallsubs.unsubscribe();
  }

  openMenu() {
    this.menuController.open();
  }

  gotoProfile(hit) {
    this.headerService.suggestionOpen = false;
    this.gotoProfileService.gotoProfile(hit);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenSubs = this.screen.width.subscribe((res) => {
        this.screenWidth = res;
      });
      this.screenOnLoginSubs = this.screen.onLogin.subscribe(() => {
        this.initData();
      });
    }
  }
  private initData() {
    this.changeCatSubs =
      this.changeOnScrollService.changeCategoryDesign.subscribe((res) => {
        this.categoryVisible = res;
      });
    this.client = algoliaserch(
      this.searchConfig.appId,
      this.searchConfig.apiKey
    );
    setTimeout(() => {
      this.strategy.preLoadRoute(["purchase"]);
    }, 1000);
    this.isUserLoggedInSubs = this.loginService.isUserLoggedIn.subscribe(
      async (res) => {
        if (res) {
          await this.loginService.getUser().then((user: User) => {
            if (user) {
              if (user.rule == "designer" && !this.visibleService.isLoaded) {
                this.chatService.initConversationList();
                this.visibleService.isLoaded = true;
                this.visibleService.isVisible.next(true);
              } else {
                this.chatsService.initConversationList();
              }
              this.userType = user.rule;
              this.isLoggedIn = true;
              this.me = user;
              this.checkIsAdminEvent.emit(this.me.rule == "admin");
              this.initChatCount(user);
              this.initNotificationCount();
            } else {
              this.checkIsAdminEvent.emit(false);
              this.isLoggedIn = false;
            }
          });
        } else {
          this.checkIsAdminEvent.emit(false);
          this.me = null;
          this.isLoggedIn = false;
        }
      }
    );
    this.searchPopupService.getCategories();
    // this.searchHideSubs = this.screen.searchHide.subscribe((flag) => {
    //   this.searchHide = flag;
    // });
  }

  private initChatCount(user: User) {
    if (user.rule === "designer") {
      this.chatService.contacts.subscribe((res) => {
        this.newMessageCount = 0;
        res.forEach((contact) => {
          if (contact.unread_message > 0) {
            this.newMessageCount++;
          }
        });
      });
    } else {
      this.chatsService.contacts.subscribe((res) => {
        this.newMessageCount = 0;
        res.forEach((contact) => {
          if (contact.unread_message > 0) {
            this.newMessageCount++;
          }
        });
      });
    }
  }

  initNotificationCount() {
    if (
      this.notificationService.notifications &&
      this.notificationService.notifications?.value?.length == 0
    ) {
      this.notificationService.getNotifications(this.me.uid);
    }
    this.notificationCountSubs =
      this.notificationService.notifications.subscribe(
        async (notifications) => {
          this.newNotification = 0;
          this.firstTimeLoaded++;
          const user = await this.loginService.getUser();

          notifications?.forEach((notification, index) => {
            if (!notification.data.seen) {
              this.newNotification++;
            }
            if (
              this.firstTimeLoaded > 2 &&
              index === 0 &&
              !notification.data.seen &&
              user
            ) {
              this.toastNotificationService.setNotification(notification, true);
            }
          });
          if (!notifications) {
            this.firstTimeLoaded = 0;
            this.newNotification = 0;
          }
        }
      );
  }

  public async openChat(event) {
    if (this.me) {
      this.dynamicTitleService.titleReset();
      await this.headerService.openChat(event);
    } else {
      this.navigate("/login", "root");
    }
  }

  public navigateRoot() {
    let currentRoute = this.getCurrentRoute();
    if (currentRoute == "/") {
      window.location.reload();
      return;
    }
    this.navController.navigateRoot("/", {
      animated: true,
      animationDirection: "back",
    });
  }

  clearText() {
    this.headerService.search = "";
    this.showResult = false;
  }

  public getCurrentRoute() {
    return this.router.url;
  }

  public navigate(url: string, type: string) {
    if (type == NAVIGATION_TYPE.ROOT)
      this.navController.navigateRoot(url, {
        animated: true,
        animationDirection: "back",
      });
    else if (type == NAVIGATION_TYPE.FORWARD) {
      this.navController.navigateForward(url);
    }
  }
}
