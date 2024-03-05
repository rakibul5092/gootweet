import { Category, SubCategory, InnerCategory } from "./category";
import { User } from "./user";

export interface Product {
  id: string;
  product_id: string;
  title: string;
  description: string;
  category: Category;
  sub_category: SubCategory;
  inner_category: InnerCategory;
  main_images: string[];
  measures: Measure[];
  aditional_images: string[];
  good: NormalGood | VariationGood[];
  delivery_time: string;
  delivery_types: Delivery[];
  video?: string;
  commision: string;
  timestamp: any;
  ownerUid?: string;
}

export interface ProductForAdd {
  title: string;
  product_id: string;
  category: Category | string;
  sub_category: SubCategory | string;
  inner_category: InnerCategory | string;
  description: string;
  main_images: string[];
  aditional_images: string[];
  good: NormalGood | VariationGood[];
  delivery_types: Delivery[];
  commision: string;
  video?: string;
  measures: Measure[];
  timestamp: any;
}

export interface ProductForCart extends Product {
  ownerId: string;
  seen: boolean;
  quantity: number;
  cart_price: number;
  cart_time: any;
  isDesigner: boolean;
  designerId: string;
  totalUnitOfMeasurment: number;
  selectedImage?: string;
}

export interface ProductDataForCart {
  cart_item_id: string;
  data: ProductForCart;
  websiteCommision: number;
  designerCommission: number;
}

export interface SortedCartItems {
  ownerUid: string;
  owner: User;
  products: ProductDataForCart[];
  totalPrice: number;
  isPaid: boolean;
}
export interface FinalSortedCartItem extends SortedCartItems {
  id: string;
  isCompleted: boolean;
  isDelivered: boolean;
  buyerUid: string;
  isAvailable: boolean;
  message: string;
  timestamp: any;
  inProgress: boolean;
  sent: boolean;
  note: string;
}

export interface DesignerOrderItem extends FinalSortedCartItem {
  commission: number;
}
export interface OrderInfo extends User {
  date: any;
  totalPice: string;
  isPaid: boolean;
  delivered: boolean;
}

export interface ProductDataForChat {
  title: string;
  product_id: string;
  description: string;
  category: Category;
  sub_category: SubCategory;
  inner_category: InnerCategory;
  good: NormalGood | VariationGood;
  main_images: string[];
  commision: string;
  timestamp: any;
}
export interface ProductForChat {
  id: string;
  data: Product;
  owner: User;
}

export interface CategoryWithProduct {
  id: string;
  category: string;
  timestamp: string;
  products: Product[];
  commission: any;
}

export interface Good {
  price: string;
  inStock: string;
}
export interface NormalGood {
  price: string;
  unit: string;
  quantity: number;
  expectedStock?: string;
  inStock?: string;
  colors?: string[];
  sizes?: string[];
}
export interface VariationGood {
  material: string;
  color: string;
  images: string[];
  description: string;
  imagesData: Image[];
  code: string;
  price: string;
  unit: string;
  quantity: number;
  expectedStock: string;
  inStock: string;
}
export interface Image {
  imageForView: string;
  base64String: string;
  format: string;
  name: string;
}
export interface Delivery {
  destination: string;
  delivery_info: DeliveryInfo;
}
export interface DeliveryInfo {
  option: string;
  price: string;
  delivery_time: string;
}
export interface Measure {
  catId?: string;
  name: string;
  measure: string;
}
export interface Color {
  id: string;
  name: string;
  code: string;
}

export interface RecomandedProduct {
  product: Product;
  owner: User;
}

export interface SingleProduct {
  product: Product;
  productOwner: User;
  isClicked: boolean;
}

export interface LiveProduct {
  id: string;
  ownerUid: string;
  liveId: string;
  title: string;
  photo: string;
  price: string;
  colors: any[];
  sizes: any[];
  about: string;
  // productIds?: string[];
  // products?: LiveProduct[];
  timestamp: any;
}
