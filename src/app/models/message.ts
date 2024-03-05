import { Product } from "./product";
import { User } from "./user";
import { WallPostForChat } from "./wall-test";

export interface MessageData {
  from: string;
  body: string;
  isRead: boolean;
  productId: string;
  product: Product;
  productOwnerUid: string;
  postId: string;
  images: string[];
  timeStamp: any;
  to: string;
  mime: string;
  type: number;
  id?: string;
}

export interface LiveMessage {
  from: User;
  body: string;
  images: string[];
  timestamp: any;
  type: number;
  id: string;
  product?: null;
}

export interface LastMessage extends MessageData {
  notified: boolean;
}

export interface Message {
  id: string;
  data: MessageData;
  wallPost: WallPostForChat;
}

// Message types according data types
// text = 1,
// image = 2,
// video = 3,
// file = 4,
// product = 5,
// wall post = 6
// array of image = 7
// cart = 8
