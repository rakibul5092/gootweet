import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-chat-normal",
  templateUrl: "./chat-normal.page.html",
  styleUrls: ["./chat-normal.page.scss"],
})
export class ChatNormalPage implements OnInit {
  nestedRouter: any;
  constructor(
    private screen: ScreenService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
    }
  }
  ionViewWillLeave() {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      this.screen.headerHide.next(false);
      this.screen.searchHide.next(false);
    }
    this.screen.fullScreen.next(false);
  }
  ionViewWillEnter() {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      this.screen.headerHide.next(true);
      this.nestedRouter = document.getElementById("nested-router");
      this.nestedRouter?.classList?.remove("main-router");
    }
    this.screen.fullScreen.next(true);
    // if (this.screen.width.value < 768) {
    // }
  }
}
