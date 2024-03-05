import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Notification } from "src/app/models/notifications";
import { DynamicTitleService } from "src/app/services/dynamic-title.service";
import { ToastNotificationService } from "./toast-notification.service";

@Component({
  selector: "app-toast-notification",
  templateUrl: "./toast-notification.component.html",
  styleUrls: ["./toast-notification.component.scss"],
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  notification: Notification;
  visible: boolean = false;
  notificationSubs: Subscription;
  isChat = true;
  constructor(
    private toasterNotificationService: ToastNotificationService,
    private dynamicTitleService: DynamicTitleService
  ) {}
  ngOnDestroy(): void {
    this.notificationSubs?.unsubscribe();
  }

  ngOnInit() {
    this.notificationSubs = this.toasterNotificationService
      .getNotification()
      .subscribe((data) => {
        if (data && data.notification) {
          this.notification = data?.notification || null;
          this.visible = data?.showToast || false;
          this.isChat = data?.isChat || false;
          console.log(data);

          this.visible =
            (Date.now() -
              data?.notification?.data?.timestamp.toDate().getTime()) /
              1000 <
            10;

          if (this.isChat && this.visible) {
            this.dynamicTitleService.onNewMessageReceived(
              data?.notification?.data?.senderInfo?.full_name?.first_name || ""
            );
          }

          if (this.notification && this.visible) {
            // const audio = new Audio(
            //   sound_base + (this.isChat ? "message.mp3" : "notification.mp3")
            // );
            // audio.muted = false;
            // console.log(audio);
            // audio.play();
          }

          setTimeout(() => {
            this.toasterNotificationService.setNotification(null);
          }, 5000);
        } else {
          this.visible = false;
          this.notification = null;
        }
      });
  }
  onClick() {}
}
