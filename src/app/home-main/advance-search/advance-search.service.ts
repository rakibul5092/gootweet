import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { first } from "rxjs/operators";
import { Product } from "src/app/models/product";
import { categories, category_products_count, products } from "../../constants";
import {
  Category,
  CatWithProductCount,
  InnerCategory,
  SubCategory,
} from "../../models/category";
import { ProductsService } from "../manufacturer/products/products.service";

@Injectable({
  providedIn: "root",
})
export class AdvanceSearchService {
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  innerCategories: InnerCategory[] = [];

  startAfter: QueryDocumentSnapshot<any>;
  moreProducts: Product[] = [];

  categoriesForShow: CatWithProductCount[] = [];
  subcategoriesForShow = [];
  innercategoriesForShow = [];

  min = "1";
  max = "100000";
  cat = "";

  constructor(
    private firestore: AngularFirestore,
    public service: ProductsService
  ) {}

  getCategories(manufacturerUid) {
    this.categoriesForShow = [];

    this.firestore
      .collection(products)
      .doc(manufacturerUid)
      .collection(category_products_count)
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query.docs.length) {
          query.forEach((val) => {
            let cat: any = val.data() as any;

            this.firestore
              .collection(categories)
              .doc(val.id)
              .get()
              .pipe(first())
              .subscribe((query) => {
                if (query.exists) {
                  let category: any = query.data();
                  this.categoriesForShow.push({
                    category_id: val.id,
                    category: category.category,
                    count: cat.count,
                    isSelected: false,
                  });
                }
              });
          });
        }
      });
  }

  getProducts(manufacturerUid, category_id: string): Product[] {
    let prods: Product[] = [];

    this.firestore
      .collection(products)
      .doc(manufacturerUid)
      .collection(products, (ref) =>
        ref.where("category.id", "==", category_id).limit(1)
      )
      .get()
      .pipe(first())
      .subscribe((query) => {
        query.forEach((item) => {
          prods.push(item.data() as Product);
        });
        return prods;
      });
    return prods;
  }
}
