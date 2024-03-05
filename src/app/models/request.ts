import { User } from "./user";

export interface RequestToManufacturer {
  designer_uid: string;
  designer_activity: string;
  designer_about: string;
  commission: number;
  seen: boolean;
  timestamp: any;
}

export interface RequestFromDesigner {
  manufacturer_uid: string;
  my_activity: string;
  my_about: string;
  commission: number;
  seen: boolean;
  timestamp: any;
}

export interface RequestM {
  request_data: RequestToManufacturer;
  id: string;
  sender_info: User;
}
export interface RequestD {
  request_data: RequestFromDesigner;
  id: string;
  sender_info: User;
}

export interface AcceptData {
  user_data: string;
  request_uid: string;
  commission: string;
}
