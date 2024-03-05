import { isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first, map } from "rxjs/operators";
import { categories, innercategories, subcategories } from "src/app/constants";
import {
  Category,
  CategoryForShow,
  InnerCategory,
  SubCategory,
  SubCategoryForShow,
} from "src/app/models/category";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SearchPopupService {
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  innerCategories: InnerCategory[] = [];
  categoriesForShow: CategoryForShow[] = [];
  loading = false;
  min = "1";
  max = "100000";
  cat = "";
  isAllDismissed = true;
  categoriesLoaded = new BehaviorSubject(false);
  subCatLoaded = new BehaviorSubject(false);
  selectedInnerCategories = new BehaviorSubject<InnerCategory[]>([]);

  constructor(
    private firestore: AngularFirestore,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  getInnerCategoriesBySubId(catId: string, subCatId: string) {
    const cat = this.categoriesForShow.find((item) => item.id === catId);
    const subCat = cat?.subCategories.find((item) => item.id === subCatId);
    if (subCat && subCat.innerCategories && subCat.innerCategories.length > 0) {
      this.selectedInnerCategories.next(subCat.innerCategories);
    } else {
      this.getInnerCategories(subCatId).then((data) => {
        this.selectedInnerCategories.next(data);
      });
    }
  }

  getSubCategoryWithInnerCategory(selectedCategory: CategoryForShow) {
    if (
      selectedCategory?.subCategories &&
      selectedCategory?.subCategories.length == 0
    ) {
      this.loading = true;
      return this.firestore
        .collection(subcategories, (ref) =>
          ref
            .where("category_id", "==", selectedCategory.id)
            .orderBy("serial", "asc")
        )
        .get()
        .pipe(
          first(),
          map((actions) =>
            actions.docs.map((ac) => {
              return {
                data: ac.data(),
                id: ac.id,
                innerCategories: [],
              } as SubCategoryForShow;
            })
          )
        )
        .subscribe((data) => {
          this.categoriesForShow.map((cat, i) => {
            if (cat.id === selectedCategory.id) {
              cat.subCategories = data;
              cat.subCategories.forEach(async (item) => {
                this.getInnerCategories(item.id).then((data) => {
                  item.innerCategories = data;
                });
              });
            }
          });
          this.loading = false;
          this.subCatLoaded.next(true);
        });
    }
  }

  async getInnerCategories(id): Promise<InnerCategory[]> {
    return await lastValueFrom(
      this.firestore
        .collection(innercategories, (ref) =>
          ref.where("sub_category_id", "==", id)
        )
        .get()
        .pipe(
          map((actions) =>
            actions.docs.map((ac) => {
              return { data: ac.data(), id: ac.id } as InnerCategory;
            })
          )
        )
    );
  }

  public getCategories() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    //currently not in use, duplicated in search-popup.page.ts
    if (this.categoriesForShow.length == 0) {
      this.categoriesForShow = [];
      // , (ref) => ref.where("product_count", ">", 0)
      this.firestore
        .collection(categories, (ref) => ref.orderBy("serial", "asc"))
        .get()
        .pipe(
          first(),
          map((actions) =>
            actions.docs.map((ac) => {
              return {
                data: ac.data(),
                id: ac.id,
                subCategories: [],
              } as CategoryForShow;
            })
          )
        )
        .subscribe((data) => {
          this.categoriesForShow = data;
          this.categories = data;
          this.categoriesLoaded.next(true);
        });
    }
  }
}
