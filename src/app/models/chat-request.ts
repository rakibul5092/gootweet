import { Product } from "./product";
import { User } from "./user";

export interface ChatRequestData {
  isFirstTime: boolean;
  budget: number;
  interestedInOtherGood: boolean;
  images: string[];
  productId: string;
  designerUid: string;
  manufacturer: User;
  user: User;
  text: string;
  isAccepted: boolean;
  prev_designer_uid: string;
  isBlocked: boolean;
  timestamp: any;
  commission: string;
}

export interface ChatRequest {
  data: ChatRequestData;
  product: Product;
  id: string;
  shortened: boolean;
}
