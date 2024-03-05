import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NOTIFICATION_TYPE } from "src/app/constants";
import { Notification } from "src/app/models/notifications";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  @Input() notification: Notification;
  @Output() onSeen: EventEmitter<any> = new EventEmitter();
  @Output() onGotoRequest: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    if (this.notification) {
      let ownerUid = "";
      if (this.notification.data.type == NOTIFICATION_TYPE.COMMENT) {
        ownerUid = this.notification.data.comment_data.commenter_uid;
      } else if (this.notification.data.type == NOTIFICATION_TYPE.REACTION) {
        ownerUid = this.notification.data.reaction_data.reactor_uid;
      } else if (this.notification.data.type == NOTIFICATION_TYPE.REQUEST) {
        ownerUid = this.notification.data.request_data.designer_uid;
      }
    }
  }
  onClick(notification: Notification) {
    this.onSeen.emit(notification);
  }
  gotoDesignerRequestPage(uid: string) {
    this.onGotoRequest.emit(uid);
  }
}
