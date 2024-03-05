import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Notification } from "src/app/models/notifications";

@Injectable({
  providedIn: "root",
})
export class ToastNotificationService {
  private toastNotification = new BehaviorSubject<{
    notification: Notification;
    showToast: boolean;
    isChat: boolean;
  }>(null);
  constructor() {}

  getNotification() {
    return this.toastNotification.asObservable();
  }
  setNotification(data: Notification, show = false, chat = false) {
    this.toastNotification.next({
      notification: data,
      showToast: show,
      isChat: chat,
    });
  }
}
