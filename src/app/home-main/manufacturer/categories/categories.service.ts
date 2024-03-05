import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first, map } from "rxjs/operators";
import { categories, innercategories, subcategories } from "../../../constants";
import {
  CategoryData,
  InnerCategoryData,
  SubCategoryData,
} from "../../../models/category";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  selectedTab = 1;

  categoriesForShow = [];
  subcategoriesForShow = [];
  innercategoriesForShow = [];

  constructor(private firestore: AngularFirestore) {}
  init() {
    this.selectedTab = 1;
    this.categoriesForShow = [];
    this.subcategoriesForShow = [];
    this.innercategoriesForShow = [];
    this.getCat();
    this.getSubCat();
    this.getInnerCat();
  }
  selectTab(no: number) {
    this.selectedTab = no;
  }

  getCat() {
    this.firestore
      .collection(categories)
      .get()
      .pipe(
        first(),
        map((actions) => {
          return actions.docs.map((a) => {
            let cat = a.data() as CategoryData;
            let id = a.id;
            return { id, data: cat, products: ["p", "r"] };
          });
        })
      )
      .subscribe((cats) => {
        this.categoriesForShow = cats;
      });
  }

  getSubCat() {
    this.firestore
      .collection(subcategories)
      .get()
      .pipe(
        first(),
        map((actions) => {
          return actions.docs.map((a) => {
            let subcat = a.data() as SubCategoryData;
            let id = a.id;
            return { id, data: subcat, products: ["p", "r"] };
          });
        })
      )
      .subscribe((subcats) => {
        this.subcategoriesForShow = subcats;
      });
  }

  getInnerCat() {
    this.firestore
      .collection(innercategories)
      .get()
      .pipe(
        first(),
        map((actions) => {
          return actions.docs.map((a) => {
            let innercat = a.data() as InnerCategoryData;
            let id = a.id;
            return { id, data: innercat, products: ["p", "r"] };
          });
        })
      )
      .subscribe((innercats) => {
        this.innercategoriesForShow = innercats;
      });
  }
}
