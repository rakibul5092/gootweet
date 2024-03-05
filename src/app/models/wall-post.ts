import { Image, Product } from "./product";

export interface WallPost {
  title: string;
  description: string;
  countries: Country[];
  productsIds: string[];
  images: string[];
  imageTab: number;
  timestamp: any;
  ownerUid: string;
  isWorkerNeeded: boolean;
  isDesignerNeeded: boolean;
}
export interface Country {
  flag: string;
  name: string;
}


