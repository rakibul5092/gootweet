export interface CategoryData {
  category: string;
  timestamp: any;
  products_count?: number;
  img?: string;
  serial?: number;
}

export interface CatWithCount extends Category {
  isSelected: boolean;
}

export interface Category {
  id: string;
  data: CategoryData;
}

export interface SubCategoryData {
  category_id: string;
  sub_category: string;
  icon?: string;
  timestamp: any;
  serial?: number;
  image?: string;
}

export interface SubCategory {
  id: string;
  data: SubCategoryData;
}

export interface InnerCategoryData {
  sub_category_id: string;
  inner_category: string;
  icon?: string;
  timestamp: any;
  products_count?: number;
  serial?: number;
}
export interface InnerCategory {
  id: string;
  data: InnerCategoryData;
  selected?: boolean;
}

export interface SubCategoryMain {
  id: string;
  sub_category: string;
  timestamp: any;
  cat_id: string;
}
export interface InnerCategoryMain {
  id: string;
  inner_category: string;
  timestamp: any;
  cat_id: string;
  sub_id: string;
}

export interface SubCategoryForProductAdd extends SubCategory {
  isSelected: boolean;
}
export interface CategoryForProductAdd extends Category {
  subCategories: SubCategoryForProductAdd[];
  isSelected: boolean;
}

export interface CategoryForShow extends Category {
  subCategories: SubCategoryForShow[];
  isSelected: boolean;
}

export interface SubCategoryForShow extends SubCategory {
  innerCategories: InnerCategory[];
}
export interface CatWithProductCount {
  category: string;
  category_id: string;
  count: number;
  isSelected?: boolean;
}
