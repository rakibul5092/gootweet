import { Category, SubCategory } from "./category";

export interface Material {
  id: string;
  name: string;
  images: string;
  category: Category;
  sub_category: SubCategory;
  code: string[];
  timestamp: string;
}
