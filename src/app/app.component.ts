import { isPlatformBrowser } from "@angular/common";
import {
  AfterContentInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import {
  IonRouterOutlet,
  MenuController,
  NavController,
  Platform,
} from "@ionic/angular";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subscription, fromEvent, merge, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { VisibleService } from "./chat/chat-designer/visible.service";
import { CallService } from "./components/calls/call.service";
import { UserLoginService } from "./login/user-login.service";
import { IncomingCall, OutgoingCall } from "./models/call.model";
import { LoginService } from "./services/login.service";
import { ScreenService } from "./services/screen.service";
import { User } from "./models/user";
declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  isAdmin: boolean = false;
  hideHeader: boolean = true;
  public modal = false;

  //call variables
  public incomingCall: IncomingCall;
  public outgoingCall: OutgoingCall;

  static isBrowser: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private networkStatus$: Subscription = Subscription.EMPTY;
  showAppNotification = false;

  admin(event) {
    this.isAdmin = event;
  }
  constructor(
    private platform: Platform,
    public visibility: VisibleService,
    public screen: ScreenService,
    private sw: SwUpdate,
    private nav: NavController,
    private toastrService: ToastrService,
    private userLoginService: UserLoginService,
    private loginService: LoginService,
    private callService: CallService,
    @Inject(PLATFORM_ID) private platform_id: any
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(this.platform_id));
  }
  ngAfterContentInit(): void {
    setTimeout(() => {
      if ($('[data-toggle="tooltip"]')) $('[data-toggle="tooltip"]').tooltip();
    }, 4000);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platform_id)) {
      this.checkNetworkStatus();
      if (environment.production) {
        this.sw.checkForUpdate().then(async () => {
          await this.sw.activateUpdate().then(() => {
            // location.reload();
          });
        });
      }
      if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
        this.showAppNotification = true;
      }
      this.initializeApp();
      this.screen.onLogin.next(true);
      this.screen.onResize(this.platform.width(), this.platform.height());
      this.screen.headerHide.subscribe((res) => {
        this.hideHeader = res;
      });
      this.userLoginService.init();
      this.screen.uploaderModal.subscribe((res) => {
        this.modal = res;
      });
    } else {
      // this.screen.height.next(768);
      // this.screen.width.next(368);
      // this.screen.headerHide.next(false);
    }
  }

  private networkChecked = 0;
  private checkNetworkStatus() {
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, "online"),
      fromEvent(window, "offline")
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((isConnected) => {
        if (isConnected && this.networkChecked === 1) {
          this.toastrService.clear();
          this.toastrService.success("Connected", "Internet Connection", {
            positionClass: "toast-bottom-left",
            tapToDismiss: false,
            closeButton: true,
          });
        } else if (this.networkChecked === 1) {
          this.toastrService.error("Disconnected", "Internet Connection", {
            positionClass: "toast-bottom-left",
            disableTimeOut: true,
            tapToDismiss: false,
            closeButton: true,
          });
        }
        this.networkChecked = 1;
      });
  }
  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    if (isPlatformBrowser(this.platform_id)) {
      if (this.networkStatus$) {
        this.networkStatus$.unsubscribe();
      }
      if (this.outgoingCall) {
        this.callService.rejectCall(this.outgoingCall);
      }
    }
  }

  private initializeApp() {
    this.loginService.getUser().then((user) => {
      if (user) {
        if (user?.rule === "admin") {
          this.nav.navigateRoot("admin/admin-categories");
        } else {
          if (user?.rule === "designer") {
            this.visibility.isVisible.next(true);
          } else {
            this.visibility.isVisible.next(false);
          }
        }
        this.setupCalls(user);
      }
    });
    // this.cookiesInit();
  }

  private setupCalls(me: User) {
    this.callService.incomingCall.subscribe((res) => {
      this.incomingCall = res;
    });
    this.callService.outgoingCall.subscribe((res) => {
      this.outgoingCall = res;
    });
    this.callService.subscribeToIncomingCall(me).subscribe((res) => {
      this.callService.incomingCall.next(res);
    });
  }

  private openAppUrl() {
    window.open(
      "https://play.google.com/store/apps/details?id=lt.igonet.furniin",
      "_blank"
    );
  }

  @HostListener("window:resize", ["$event"])
  private onResize(event) {
    this.screen.onResize(event.target.innerWidth, event.target.innerHeight);
  }
}
