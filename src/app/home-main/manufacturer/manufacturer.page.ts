import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { GotoProfileService } from "../../services/goto-profile.service";
import { VisibleService } from "../../chat/chat-designer/visible.service";
import { ChatService } from "../../chat/chat-designer/chat.service";
import { getUser } from "../../services/functions/functions";
import { first } from "rxjs/operators";

@Component({
  selector: "app-manufacturer",
  templateUrl: "./manufacturer.page.html",
  styleUrls: ["./manufacturer.page.scss"],
})
export class ManufacturerPage implements OnInit {
  isMyProfile: boolean = false;
  isManufacturerLoggedIn: boolean = false;
  header: any;
  leftBar: any;
  rightBar: any;
  me: User;
  activePage: string = "profile";
  constructor(
    private router: Router,
    private gotoProfileService: GotoProfileService,
    private visibleService: VisibleService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        this.me = user;
        this.isManufacturerLoggedIn = this.me.rule == "manufacturer";
        this.checkActivePage();
        if (user.rule == "designer") {
          if (!this.visibleService.isLoaded) {
            this.chatService.initConversationList();
            this.visibleService.isLoaded = true;
            this.visibleService.isVisible.next(true);
          }
        } else {
          this.visibleService.isVisible.next(false);
        }
      }
    });
  }

  onActivate(componentReference) {
    if (componentReference.profileCheckEvent) {
      componentReference.profileCheckEvent.pipe(first()).subscribe((data) => {
        this.isMyProfile = data;
      });
    }
    if (componentReference.activePageCheckEvent) {
      componentReference.activePageCheckEvent
        .pipe(first())
        .subscribe((data: string) => {
          this.activePage = data;
        });
    }
  }

  checkActivePage() {
    if (this.router.url.startsWith("/profile/")) this.onActivatePage("profile");
    else if (this.router.url == "/profile/products")
      this.onActivatePage("products");
    else if (this.router.url == "/profile/categories")
      this.onActivatePage("categories");
    else if (this.router.url == "/profile/materials")
      this.onActivatePage("materials");
    else if (this.router.url == "/profile/manufacturer-order")
      this.onActivatePage("manufacturer-order");
    else if (this.router.url == "/profile/connected-designer")
      this.onActivatePage("connected-designer");
  }

  onActivatePage(pageName: string) {
    this.activePage = pageName;
    if (this.activePage == "profile" && this.isMyProfile)
      this.gotoProfileService.gotoProfile(this.me);
  }
}
