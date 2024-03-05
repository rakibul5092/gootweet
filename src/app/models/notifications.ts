import { RequestToManufacturer } from "./request";
import { CommentData, ReactData } from "./wall-test";
import { User } from "./user";
import { IncomingCall } from "./call.model";

export interface NotificationData {
  type: number;
  seen: boolean;
  timestamp: any;
  senderInfo: User;
  request_data: RequestToManufacturer;
  comment_data: CommenterDataForNotification;
  reaction_data: any;
  missedCallData?: IncomingCall;
}
export interface CommenterDataForNotification extends CommentData {
  wall_post_id: string;
}
export interface ReactDataForNotification extends ReactData {
  wall_post_id: string;
}

export interface Notification {
  id: string;
  data: NotificationData;
}
