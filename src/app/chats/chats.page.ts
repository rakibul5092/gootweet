import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { ScreenService } from "../services/screen.service";
import { ChatsService } from "./chats.service";

declare var $: any;
@Component({
  selector: "app-chats",
  templateUrl: "./chats.page.html",
  styleUrls: ["./chats.page.scss"],
})
export class ChatsPage implements OnInit {
  constructor(
    public service: ChatsService,
    private popoverController: PopoverController,
    public screen: ScreenService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  openMessage(contact: any) {
    this.service.openMessage(contact);
    this.popoverController.dismiss();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (
        this.service.contacts.value &&
        this.service.contacts.value.length == 0
      ) {
        this.service.initConversationList();
      }
    }
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.service.ngOnDestroy();
    }
  }
}
