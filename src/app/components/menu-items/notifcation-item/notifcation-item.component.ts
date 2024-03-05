import { Component, Input, OnInit } from "@angular/core";
import { NavController, PopoverController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { NotificationsPage } from "../../popovers/notifications/notifications.page";
import { NotificationsService } from "../../popovers/notifications/notifications.service";

@Component({
  selector: "app-notifcation-item",
  templateUrl: "./notifcation-item.component.html",
  styleUrls: ["./notifcation-item.component.scss"],
})
export class NotifcationItemComponent implements OnInit {
  @Input() me: User;
  isNotifiPopoverOpened = false;
  @Input() unseenNotificationCount: number = 0;

  constructor(
    private popoverController: PopoverController,
    private nav: NavController,
    private notificationService: NotificationsService
  ) {}
  ngOnInit() {}

  async openNotification(event) {
    if (!event) {
      return;
    }
    if (this.me) {
      this.isNotifiPopoverOpened = true;
      const data = {
        unseenNotifications: this.unseenNotificationCount,
      };
      let notification = await this.popoverController.create({
        component: NotificationsPage,
        event: event,
        cssClass: "popover-notification",
        mode: "ios",
        componentProps: data,
      });
      notification.onDidDismiss().then(() => {
        this.isNotifiPopoverOpened = false;
        this.notificationService
          .updateNotificationToSeen(this.me.uid)
          .subscribe();
      });

      return await notification.present();
    } else {
      this.nav.navigateBack("login", {
        animated: true,
        animationDirection: "back",
      });
    }
  }
}
