import { Component, Input, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";
import { LoginService } from "src/app/services/login.service";
import { NOTIFICATION_TYPE } from "../../../constants";
import { User } from "../../../models/user";
import { NotificationsService } from "./notifications.service";
import { CallService } from "../../calls/call.service";
import { Notification } from "src/app/models/notifications";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit {
  @Input() unseenNotifications: number;
  me: User;

  constructor(
    public notificationService: NotificationsService,
    private navController: NavController,
    private popoverController: PopoverController,
    private storage: LoginService,
    private callService: CallService
  ) {}

  async ngOnInit() {
    console.log("Notification:", this.unseenNotifications);

    await this.storage.getUser().then((user) => {
      if (user) {
        this.me = user;
        if (this.notificationService?.notifications?.value.length == 0) {
          this.notificationService.getNotifications(this.me.uid);
        }
      }
    });
  }

  gotoDesignerRequestPage(uid: string) {
    this.popoverController.dismiss();
    const params: NavigationExtras = {
      queryParams: {
        requestUid: uid,
      },
    };

    this.navController.navigateForward("designer/designer-request", params);
  }

  onSeen(notification: Notification) {
    this.popoverController.dismiss();
    let wallPostId: string;
    if (notification.data.type === NOTIFICATION_TYPE.COMMENT) {
      wallPostId = notification.data.comment_data.wall_post_id;
      this.gotoSinglePost(
        wallPostId,
        "comment",
        notification.data.comment_data.comment_id
      );
    } else if (notification.data.type === NOTIFICATION_TYPE.REACTION) {
      wallPostId = notification.data.reaction_data.wall_post_id;
      this.gotoSinglePost(wallPostId, "reaction", null);
    } else if (notification.data.type === NOTIFICATION_TYPE.REQUEST) {
      this.gotoDesignerRequestPage(notification.data?.senderInfo?.uid);
    } else if (notification.data.type === NOTIFICATION_TYPE.MISSEDCALL) {
      this.callService.makeCall(
        notification.data.missedCallData.callerInfo,
        this.me
      );
    }
  }
  gotoSinglePost(wallId: string, redirectionWith: string, comment_id: string) {
    let navExtra: NavigationExtras = {
      queryParams: {
        id: wallId,
        redirection: redirectionWith,
        comment_id: comment_id,
      },
    };
    this.navController.navigateForward("wallpost", navExtra);
  }

  dismiss() {
    this.popoverController.dismiss();
  }
}
