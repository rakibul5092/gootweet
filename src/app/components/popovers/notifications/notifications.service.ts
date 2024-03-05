import { Injectable, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first, map } from "rxjs/operators";
import {
  cloud_function_base_url,
  notifications,
  requests,
  users,
} from "../../../constants";
import { Notification, NotificationData } from "../../../models/notifications";
import { RequestM } from "../../../models/request";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class NotificationsService implements OnDestroy {
  notificationDataSeen: RequestM[] = [];
  notificationDataUnSeen: RequestM[] = [];
  haveDataSeen = true;
  haveDataUnSeen = true;

  loaded = false;
  notifications = new BehaviorSubject<Notification[]>([]);
  notiSubs: any;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}
  ngOnDestroy(): void {
    if (this.notiSubs) this.notiSubs.unsubscribe();
  }

  updateNotificationToSeen(uid: string) {
    const url =
      cloud_function_base_url + "/updateNotificationToSeen?uid=" + uid;
    return this.http.get(url).pipe(first());
  }

  getNotifications(uid: string) {
    this.notiSubs = this.firestore
      .collection(notifications)
      .doc(uid)
      .collection(notifications, (ref) =>
        ref.orderBy("timestamp", "desc").limit(10)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            let data = a.payload.doc.data() as NotificationData;
            let notification: Notification = {
              data: data,
              id: a.payload.doc.id,
            };
            return notification;
          });
        })
      )
      .subscribe((data) => {
        this.notifications.next(data);
        this.loaded = true;
      });
  }
}
