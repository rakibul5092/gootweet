import { LiveProduct } from "./product";
import { User } from "./user";

export interface LiveStream {
  id: string;
  about: string;
  thumb: string;
  videoUrl: string;
  public_id?: string;
  live?: boolean;
  owner: User;
  views: number;
  fileList?: any[];
  timestamp: any;
  liveProducts?: LiveProduct[];
  channel_name: string;
  uid: string;
  recorded?: boolean;
  wasLive: boolean;
}

export interface LiveApiResponse {
  data: LiveStream[];
  status: boolean;
  statusCode: number;
  message: string;
}
