import { Component, OnInit } from "@angular/core";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-chat-designer",
  templateUrl: "./chat-designer.page.html",
  styleUrls: ["./chat-designer.page.scss"],
})
export class ChatDesignerPage implements OnInit {
  nestedRouter: any;
  constructor(private screen: ScreenService) { }

  ionViewWillLeave() {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      this.screen.headerHide.next(false);
      this.screen.searchHide.next(false);
    }
    this.screen.fullScreen.next(false)
  }
  ionViewWillEnter() {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      this.screen.headerHide.next(true);
      this.nestedRouter = document.getElementById("nested-router");
      this.nestedRouter?.classList?.remove("main-router");
    }
    this.screen.fullScreen.next(true)
    // if (this.screen.width.value < 768) {
    // }
  }
  ionViewDidEnter() { }

  ngOnInit() { }
}
