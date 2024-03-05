import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { MessengerService } from "src/app/services/messenger.service";
import { UtilityService } from "src/app/services/utility.service";
import { users } from "../../constants";
import { User } from "../../models/user";
import { DesignerManufacturerAlphabeticallyService } from "./designer-manufacturer-alphabetically.service";
import { GotoProfileService } from "../../services/goto-profile.service";
import { getUser } from "../../services/functions/functions";
import { SelectiveLoadingStrategy } from "../../custom-preload-strategy";
import { first } from "rxjs/operators";

@Component({
  selector: "app-designer-manufacturer-alphabetically",
  templateUrl: "./designer-manufacturer-alphabetically.page.html",
  styleUrls: ["./designer-manufacturer-alphabetically.page.scss"],
})
export class DesignerManufacturerAlphabeticallyPage implements OnInit {
  manufacturer: any;
  loaded = false;
  isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
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
    public manufacturerService: DesignerManufacturerAlphabeticallyService,
    private nav: NavController,
    private firestore: AngularFirestore,
    public util: UtilityService,
    private visible: VisibleService,
    private messengerService: MessengerService,
    private gotoProfileService: GotoProfileService,
    private strategy: SelectiveLoadingStrategy
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        setTimeout(() => {
          this.strategy.preLoadRoute(["designer-my-manufacturer-catalog-one"]);
        }, 1000);
        this.userType = user.rule;
        this.isLoggedin.next(true);
        this.me = user;
        if (!this.visible.isLoaded) {
          this.messengerService.openMessenger(this.me);
          this.visible.isLoaded = true;
        }
        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            if (query) {
              let data: any = query.data();
              if (user.rule === "designer") {
                this.me.address = data?.details?.address;
                this.me.profile_photo = data?.profile_photo;
                this.me.full_name = {
                  first_name: data?.full_name?.first_name,
                  last_name: data?.full_name?.last_name,
                };
                this.full_name = data?.full_name;
              } else {
                this.nav.navigateForward("/");
              }
            }
          });
        this.manufacturerService.find(this.me.uid);
      } else {
        this.nav.navigateForward("/");
      }
    });
  }

  findNext(e) {
    if (this.me) {
      this.manufacturerService.find(this.me.uid);
      setTimeout(() => {
        e.target.complete();
      }, 2000);
    }
  }

  gotoManufacturerCatalog() {
    this.nav.navigateForward(["designer/designer-my-manufacturer-catalog-one"]);
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
