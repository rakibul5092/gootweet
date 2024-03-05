import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";
import { first, map } from "rxjs/operators";
import { UtilityService } from "src/app/services/utility.service";
import {
  categories,
  cloud_function_base_url,
  innercategories,
  subcategories,
} from "../../../constants";
import {
  Category,
  CategoryData,
  InnerCategory,
  InnerCategoryData,
  InnerCategoryMain,
  SubCategory,
  SubCategoryData,
  SubCategoryMain,
} from "../../../models/category";
import { User } from "../../../models/user";

interface CategoryWithSelection {
  from: Category;
  to: Category;
  category: Category;
}
@Injectable({
  providedIn: "root",
})
export class CategoriesService implements OnDestroy {
  selectedTab = 1;
  me: User;
  categories: CategoryWithSelection[] = [];
  subCategories: SubCategory[] = [];
  innerCategories: InnerCategory[] = [];
  catSubs: Subscription;
  subCatSubs: Subscription;
  innerSubs: Subscription;

  constructor(
    private firestore: AngularFirestore,
    public util: UtilityService,
    private http: HttpClient
  ) {}
  ngOnDestroy(): void {
    if (this.catSubs) this.catSubs.unsubscribe();
    if (this.subCatSubs) this.subCatSubs.unsubscribe();
    if (this.innerSubs) this.innerSubs.unsubscribe();
  }
  init(me: User) {
    this.selectedTab = 1;
    this.categories = [];
    this.subCategories = [];
    this.innerCategories = [];
    this.me = me;
    this.getAllCategories();
  }
  selectTab(no: number) {
    this.selectedTab = no;
    if (no == 1) {
      if (this.categories.length == 0) {
        this.getAllCategories();
      }
    } else if (no == 2) {
      if (this.subCategories.length == 0) {
        this.getAllSubCategories();
      }
    } else if (no == 3) {
      if (this.innerCategories.length == 0) {
        this.getAllInnerCategories();
      }
    }
  }

  async swapCat(from: number, fromId: string, to: number, toId: string) {
    const batch = this.firestore.firestore.batch();
    batch.update(this.firestore.collection(categories).doc(fromId).ref, {
      serial: to,
    });
    batch.update(this.firestore.collection(categories).doc(toId).ref, {
      serial: from,
    });
    await batch.commit();
  }

  async swapSubCat(from: number, fromId: string, to: number, toId: string) {
    const batch = this.firestore.firestore.batch();
    batch.update(this.firestore.collection(subcategories).doc(fromId).ref, {
      serial: to,
    });
    batch.update(this.firestore.collection(subcategories).doc(toId).ref, {
      serial: from,
    });
    await batch.commit();
  }

  async swapInnerCat(from: number, fromId: string, to: number, toId: string) {
    const batch = this.firestore.firestore.batch();
    batch.update(this.firestore.collection(innercategories).doc(fromId).ref, {
      timestamp: to,
    });
    batch.update(this.firestore.collection(innercategories).doc(toId).ref, {
      timestamp: from,
    });
    await batch.commit();
  }
  getAllCategories() {
    try {
      let collection: AngularFirestoreCollection<Category> =
        this.getCategoryCollection();
      this.categoryQuery(collection);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async saveIcon(col: string, id: string, icon: string) {
    await this.firestore.collection(col).doc(id).update({ icon });
  }

  getCategoryCollection(): AngularFirestoreCollection<Category> {
    return this.firestore.collection(categories, (ref) =>
      ref.orderBy("serial", "asc")
    );
  }

  categoryQuery(collection: AngularFirestoreCollection) {
    try {
      this.catSubs = collection
        .snapshotChanges()
        .pipe(
          map((actions) => {
            return actions.map((a) => {
              let id = a.payload.doc.id;
              let c = a.payload.doc.data();
              return {
                from: null,
                to: null,
                category: {
                  id: id,
                  data: {
                    category: c.category,
                    timestamp: c.timestamp,
                    product_count: c?.product_count ? c.product_count : 0,
                    img: c.img || "",
                    serial: c.serial || 1,
                  },
                },
              } as CategoryWithSelection;
            });
          })
        )
        .subscribe((data) => {
          this.categories = data;
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getAllSubCategories() {
    try {
      let collection: AngularFirestoreCollection<SubCategory> =
        this.getSubCategoryCollection();
      this.subCategoryQuery(collection);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getSubCategoryCollection(): AngularFirestoreCollection<SubCategory> {
    return this.firestore.collection(subcategories, (ref) =>
      ref.orderBy("sub_category", "asc")
    );
  }

  subCategoryQuery(collection: AngularFirestoreCollection) {
    try {
      this.subCatSubs = collection
        .snapshotChanges()
        .pipe(
          map((actions) => {
            return actions.map((a) => {
              return {
                id: a.payload.doc.id,
                data: a.payload.doc.data(),
              } as SubCategory;
            });
          })
        )
        .subscribe((data) => {
          this.subCategories = data;
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getAllInnerCategories() {
    try {
      let collection: AngularFirestoreCollection<InnerCategory> =
        this.getInnerCategoryCollection();
      this.innerCategoryQuery(collection);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getInnerCategoryCollection(): AngularFirestoreCollection<InnerCategory> {
    return this.firestore.collection(innercategories, (ref) =>
      ref.orderBy("inner_category", "asc")
    );
  }

  innerCategoryQuery(collection: AngularFirestoreCollection) {
    try {
      this.innerSubs = collection
        .snapshotChanges()
        .pipe(
          map((actions) => {
            return actions.map((a) => {
              let id = a.payload.doc.id;
              let c = a.payload.doc.data() as InnerCategoryData;
              return {
                id: id,
                data: {
                  inner_category: c.inner_category,
                  sub_category_id: c.sub_category_id,
                  timestamp: c.timestamp,
                  icon: c.icon || "",
                  serail: c.serial || 0,
                },
              };
            });
          })
        )
        .subscribe((data) => {
          this.innerCategories = data;
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  deleteCategory(cat: Category) {
    this.firestore
      .collection(categories)
      .doc(cat.id)
      .delete()
      .then(() => {
        this.util.showToast("Sėkmingai pašalintas!", "danger");
      });
  }
  deleteSubCategory(sub: SubCategoryMain) {
    this.firestore
      .collection(subcategories)
      .doc(sub.id)
      .delete()
      .then(() => {
        this.util.showToast("Sėkmingai pašalintas!", "danger");
      });
  }
  deleteInnerCategory(inner: InnerCategoryMain) {
    this.firestore
      .collection(innercategories)
      .doc(inner.id)
      .delete()
      .then(() => {
        this.util.showToast("Sėkmingai pašalintas!", "danger");
      });
  }
  async updateCat(oldId: string, update: string) {
    await this.firestore
      .collection(categories)
      .doc(oldId)
      .update({ category: update })
      .then(() => {
        this.util.showToast("Category updated", "success").then(() => {
          this.submitChanges(oldId, update);
        });
      });
  }
  async updateSub(oldId: string, update: string) {
    await this.firestore
      .collection(subcategories)
      .doc(oldId)
      .update({ sub_category: update })
      .then(() => {
        this.util.showToast("Subcategory updated", "success");
      });
  }
  async updateSubImage(id: string, img: string) {
    await this.firestore
      .collection(subcategories)
      .doc(id)
      .update({ image: img })
      .then(() => {
        this.util.showToast("Subcategory updated", "success");
      });
  }
  async updateInner(oldId: string, update: string) {
    await this.firestore
      .collection(innercategories)
      .doc(oldId)
      .update({ inner_category: update })
      .then(() => {
        this.util.showToast("Inner category updated", "success");
      });
  }

  submitChanges(oldId: string, updateId: string) {
    const url =
      cloud_function_base_url +
      "/changeCategory?old_id=" +
      oldId +
      "&update_id=" +
      updateId;
    this.initChangeSubmit(url)
      .pipe(first())
      .subscribe((res: any) => {
        if (res.status) {
          this.util.showToast(
            "Submitted success, please wait for complete.",
            "success"
          );
        }
      });
  }

  initChangeSubmit(url: string) {
    return this.http.get(url);
  }

  async updateCatImage(catId: string, img: string) {
    await this.firestore
      .collection(categories)
      .doc(catId)
      .set({ img: img }, { merge: true })
      .then(async () => {
        await this.util.showToast("Category updated", "success");
      });
  }
}
