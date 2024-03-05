import {
  DocumentData,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { MessageData } from "./message";

export interface User {
  uid: string;
  email: string;
  fb_id: string;
  google_id: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  address: string;
  phone: string;
  profile_photo: string;
  cover_photo: string;
  rule: string;
  followers?: number;
  category: string;
  is_first_time: boolean;
  lastMessage: MessageData;
  emailVerified: boolean;
  unread_message: number;
  details: any;
  status: string;
}
export interface ConnectedDesigner extends User {
  vip: boolean;
  isOnline: boolean;
}

export interface UserExtend extends User {
  city: string;
  street: string;
  postal_code: string;
  flat_number: string;
  house_number: string;
}
export interface UserInforForPurchase extends User {
  city: string;
  postal_code: string;
  house_number: string;
  flat_number: string;
}

export interface ConversationUser {
  uid: string;
  email: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  profile_photo: string;
  rule: string;
  unread_message: number;
  lastMessage: MessageData;
}

export interface UserForRequestCheck extends User {
  isRequested: boolean;
  averageCommission: number;
  collRef: DocumentReference<DocumentData>;
}
export interface UserForConnectionCheck extends User {
  isConnected: boolean;
}

export interface Designer extends User {
  activity: string;
  about: string;
}

export interface UnverifiedUser {
  email: string;
  pass: string;
}

export interface RetailChainCenter extends User {}
