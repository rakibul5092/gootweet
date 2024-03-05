import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { MessengerService } from "src/app/services/messenger.service";
import { SelectiveLoadingStrategy } from "../../custom-preload-strategy";
import { User } from "../../models/user";
import { getUser } from "../../services/functions/functions";
import { GotoProfileService } from "../../services/goto-profile.service";
import { DesignerMyManufacturerCatalogOneService } from "./designer-my-manufacturer-catalog-one.service";

@Component({
  selector: "app-designer-my-manufacturer-catalog-one",
  templateUrl: "./designer-my-manufacturer-catalog-one.page.html",
  styleUrls: ["./designer-my-manufacturer-catalog-one.page.scss"],
})
export class DesignerMyManufacturerCatalogOnePage implements OnInit {
  manufacturer: any;
  loggedInDesigner: User;
  comission = 25;
  isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  matched: boolean = true;
  isMessenger: boolean = false;
  me: User;
  full_name = {
    first_name: "",
    last_name: "",
  };

  constructor(
    public manufacturerService: DesignerMyManufacturerCatalogOneService,
    private nav: NavController,
    private messengerService: MessengerService,
    private visible: VisibleService,
    private gotoProfileService: GotoProfileService,
    private strategy: SelectiveLoadingStrategy
  ) {}

  ngOnInit() {
    this.manufacturerService.loading = true;
    this.manufacturer = this.manufacturerService.manufacturers;
    setTimeout(() => {
      this.strategy.preLoadRoute(["designer-sending-request"]);
    }, 1000);
    getUser().then((user: User) => {
      if (user) {
        this.userType = user.rule;
        this.userTypeInNumber.next(
          this.userType === "manufacturer" ||
            this.userType === "retailchaincenter"
            ? 1
            : 2
        );
        this.isLoggedin.next(true);
        this.me = user;
        this.manufacturerService.manufacturers = [];
        this.manufacturerService.find();
        this.loggedInDesigner = user;

        if (!this.visible.isLoaded) {
          this.messengerService.openMessenger(this.me);
          this.visible.isLoaded = true;
        }
      } else {
        this.nav.navigateForward("/");
      }
    });
  }
  ionViewWillEnter() {}

  findNext(e) {
    // this.manufacturerService.find();
    e.target.complete();
  }

  askRequest(manufacturerUid) {
    const data: NavigationExtras = {
      queryParams: {
        manufacturer: manufacturerUid,
      },
    };
    this.nav.navigateForward(["designer/designer-sending-request"], data);
  }

  gotoProfile(owner) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
