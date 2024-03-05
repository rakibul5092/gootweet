import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NavController, PopoverController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { lazyImage } from "src/app/constants";
import { Product, ProductForChat } from "src/app/models/product";
import { User } from "src/app/models/user";
import { WalletData } from "src/app/models/wallet";
import {
  openPhoto,
  openPhotoFromArray,
} from "src/app/services/functions/functions";
import { LoginService } from "src/app/services/login.service";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { ScreenService } from "src/app/services/screen.service";
import { WalletService } from "src/app/services/wallet.service";
import { GotoProfileService } from "../../../services/goto-profile.service";
import { ChatService } from "../chat.service";
import { VisibleService } from "../visible.service";
import { CallService } from "src/app/components/calls/call.service";

@Component({
  selector: "app-conversations",
  templateUrl: "./conversations.component.html",
  styleUrls: ["./conversations.component.scss"],
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @ViewChild("scrollToMe") public scrollToMe: ElementRef;
  droppedData: any;
  // minimized = false;

  me: User;

  openPhoto = openPhoto;
  openPhotoFromArray = openPhotoFromArray;

  walletInfo: WalletData = {
    balance: 0,
    currency: "",
  };

  isAllReq = false;
  default = lazyImage;
  sliceEnd = 1;
  isAllShowing = false;
  constructor(
    public visibility: VisibleService,
    public service: ChatService,
    private walletService: WalletService,
    private navController: NavController,
    public screen: ScreenService,
    private popoverController: PopoverController,
    private gotoProfileService: GotoProfileService,
    private loginService: LoginService,
    private openProductService: OpenSingleProductService,
    private callService: CallService
  ) {}

  public makeCall() {
    this.callService.makeCall(this.service.selectedContact, this.service.me);
  }
  requestCollapse() {
    if (this.isAllShowing) {
      this.sliceEnd = 1;
      this.isAllShowing = false;
    } else {
      this.sliceEnd = this.service.requestList.length;
      this.isAllShowing = true;
    }
  }
  sendMessage({ param1, param2, flag }) {
    this.service.sendMessage(param1, param2, flag);
  }

  screenSubs: Subscription;
  ngOnInit() {
    this.screenSubs = this.screen.onLogin.subscribe(() => {
      this.loginService.getUser().then((user: User) => {
        this.me = user;
        if (this.me) {
          this.walletService
            .getWalletData(this.me.uid)
            .pipe(first())
            .subscribe((query) => {
              this.walletInfo = query.data() as WalletData;
            });
        }
      });
      this.service.initConversationList();
      if (this.screen.width.value < 768) {
        if (!this.visibility.isLoaded) {
          this.visibility.isLoaded = true;
        }
      }
    });
  }

  ngAfterViewChecked() {
    if (true) {
      this.service.initScrollView(this.scrollToMe);
    }
  }

  minimize() {
    this.visibility.minimized.next(true);
  }
  maximized() {
    this.visibility.minimized.next(false);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drop(event) {
    event.preventDefault();
    this.service.selectedProduct = JSON.parse(
      event.dataTransfer.getData("product")
    ) as ProductForChat;
  }

  navigateToSetting() {
    this.navController.navigateForward("/designer/designer-general-settings");
  }

  navigateToWallet() {
    this.navController.navigateForward("/designer/designer-wallet");
  }

  async openProduct(
    productId: string,
    product: Product,
    productOwnerUid: string,
    isMessenger = true
  ) {
    this.openProductService.openSingleProduct(product, {
      uid: productOwnerUid,
    } as any);
  }

  gotoProfile() {
    this.gotoProfileService.gotoProfile(this.service.me);
  }

  gotoHome() {
    this.navController.navigateBack("/", {
      animated: true,
      animationDirection: "back",
    });
  }

  ngOnDestroy(): void {
    if (this.screenSubs) this.screenSubs.unsubscribe();
  }
}
