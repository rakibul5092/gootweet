import { Injectable, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first } from "rxjs/operators";
import { UtilityService } from "src/app/services/utility.service";
import {
  categories,
  commissions,
  innercategories,
  subcategories,
} from "../../../../constants";
import {
  Category,
  InnerCategory,
  InnerCategoryData,
  SubCategory,
  SubCategoryData,
} from "../../../../models/category";
import { User } from "../../../../models/user";
import { getTimestamp } from "../../../../services/functions/functions";
import { CategoriesService } from "../categories.service";
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AddCategoriesService implements OnDestroy {
  selectedTab = 1;

  category: Category = {
    data: {
      category: "",
      timestamp: "",
      products_count: 0,
    },
    id: "",
  };

  subCategory: SubCategory = {
    data: {
      category_id: "",
      sub_category: "",
      timestamp: "",
    },
    id: "",
  };

  innerCategory: InnerCategory = {
    data: {
      sub_category_id: "",
      inner_category: "",
      timestamp: "",
    },
    id: "",
  };

  subCategories: SubCategory[];
  innerCategories: InnerCategory[];

  me: User;
  subCatSubs: any;
  innerCatSubs: any;
  constructor(
    private firestore: AngularFirestore,
    public catService: CategoriesService,
    public utils: UtilityService,
    private alertController: AlertController
  ) {}
  ngOnDestroy(): void {
    if (this.subCatSubs) this.subCatSubs.unsubscribe();
    if (this.innerCatSubs) this.innerCatSubs.unsubscribe();
  }

  init(me: User) {
    this.selectedTab = 1;
    this.subCategories = [];
    this.innerCategories = [];
    this.me = me;
  }

  addCategory() {
    if (this.me) {
      let timestamp = getTimestamp();
      this.firestore
        .collection(categories, (ref) =>
          ref.where("category", "==", this.category.data.category)
        )
        .get()
        .pipe(first())
        .subscribe((query) => {
          if (query.empty) {
            this.firestore
              .collection(categories)
              .add({
                uid: this.me.uid,
                category: this.category.data.category,
                timestamp: timestamp,
                serial:
                  Number(
                    this.catService?.categories[
                      this.catService?.categories?.length - 1
                    ]?.category?.data?.serial || 15
                  ) + 1,
              })
              .then(() => {
                this.firestore
                  .collection(commissions)
                  .doc(this.me.uid)
                  .collection(commissions)
                  .doc(this.category.data.category)
                  .set({ commission: 5 })
                  .then(() => {
                    this.category.data.category = "";
                    this.utils.showToast(
                      "kategorija pridėta sėkmingai!",
                      "success"
                    );
                  });
              });
          } else {
            this.utils.showToast("Category exists", "danger");
          }
        });
    }
  }

  selectedCategory(cat) {
    // this.subCatSubs?.unsubscribe();
    this.getSubCategories(this.category.id);
    this.innerCategories = [];
  }

  tabFlag = true;
  selectTab(no: number) {
    if (no == 1) {
      this.selectedTab = no;
      this.category.data.category = "";
      this.tabFlag = true;
    } else if (no == 2) {
      if (this.catService.categories) {
        this.selectedTab = no;
        this.tabFlag = true;
        this.subCategory.data.sub_category = "";
      } else {
        this.utils.showToast("Kategorijų nėra...", "danger");
      }
    } else if (no == 3) {
      if (this.catService.categories) {
        this.selectedTab = no;
        this.tabFlag = false;
        this.innerCategory.data.inner_category = "";
      } else {
        this.utils.showToast("Kategorijų nėra...", "danger");
      }

      this.selectedTab = no;
    }
  }

  // sub category logic here ....................................
  addSubCategory() {
    console.log(this.category);

    if (
      this.me &&
      (!this.category ||
        (this.category.data.category !== "" && this.category.id !== ""))
    ) {
      let timestamp = getTimestamp();

      this.firestore
        .collection(subcategories, (ref) =>
          ref
            .where("category_id", "==", this.category.id)
            .where("sub_category", "==", this.subCategory.data.sub_category)
        )
        .get()
        .pipe(first())
        .subscribe((query) => {
          if (query.empty) {
            this.firestore
              .collection(subcategories)
              .add({
                uid: this.me.uid,
                category_id: this.category.id,
                sub_category: this.subCategory.data.sub_category,
                timestamp: timestamp,
                serial:
                  Number(
                    this.subCategories[this.subCategories?.length - 1]?.data
                      ?.serial || 1000
                  ) + 1,
              })
              .then(() => {
                this.subCategory.data.sub_category = "";
                this.utils.showToast(
                  "Sub kategorija pridėta sėkmingai!",
                  "success"
                );
              });
          } else {
            this.utils.showAlert("Exists", "Subcategory exists!");
          }
        });
    } else {
      this.utils.showToast("Select category", "danger");
    }
  }
  getSubCategories(id: string) {
    this.subCategory = {
      data: {
        category_id: "",
        sub_category: "",
        timestamp: "",
      },
      id: "",
    };
    let ref;
    if (id == "all") {
      ref = this.firestore.collection(subcategories, (ref) =>
        ref.orderBy("serial", "asc")
      );
    } else {
      ref = this.firestore.collection(subcategories, (ref) =>
        ref.orderBy("serial", "asc").where("category_id", "==", id)
      );
    }
    this.subCatSubs = ref.snapshotChanges().subscribe((query) => {
      this.subCategories = [];
      query.forEach((item) => {
        let id = item.payload.doc.id;
        let data = item.payload.doc.data() as SubCategoryData;
        this.subCategories.push({
          id: id,
          data: data,
        });
      });
    });
  }

  selectedSubCategory(subCategory: SubCategory) {
    // this.innerCatSubs?.unsubscribe();
    this.getInnerCategories(this.subCategory?.id);
  }

  // inner category logic here ....................................
  addInnerCategory() {
    if (
      this.me &&
      this.subCategory &&
      this.subCategory.data.sub_category !== "" &&
      this.subCategory.id !== ""
    ) {
      let timestamp = getTimestamp();
      this.firestore
        .collection(innercategories)
        .add({
          uid: this.me.uid,
          inner_category: this.innerCategory.data.inner_category,
          sub_category_id: this.subCategory.id,
          timestamp: timestamp,
          serial:
            Number(
              this.innerCategories[this.innerCategories.length - 1]?.data
                ?.serial || 1000
            ) + 1,
        })
        .then(() => {
          this.innerCategory.data.inner_category = "";
          this.utils.showToast(
            "Inner kategorija pridėta sėkmingai!",
            "success"
          );
        });
    } else {
      this.utils.showToast("Select subcategory", "danger");
    }
  }
  getInnerCategories(id: string) {
    let ref;
    if (id == "all") {
      ref = this.firestore.collection(innercategories, (ref) =>
        ref.orderBy("timestamp", "asc")
      );
    } else {
      ref = this.firestore.collection(innercategories, (ref) =>
        ref.orderBy("timestamp", "asc").where("sub_category_id", "==", id)
      );
    }
    this.innerCatSubs = ref.snapshotChanges().subscribe((query) => {
      this.innerCategories = [];
      if (query.length > 0)
        query.forEach((item) => {
          let id = item.payload.doc.id;
          let data = item.payload.doc.data() as InnerCategoryData;
          this.innerCategories.push({
            id: id,
            data: data,
          });
        });
    });
  }

  async askDeletePermission(obj: any, type: number) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Patvirtinimas!",
      message: "Ar tikrai norite ištrinti?",
      mode: "ios",
      buttons: [
        {
          text: "Nutarukti",
          handler: async () => {
            await this.alertController.dismiss();
          },
        },
        {
          text: "Istrinti",
          cssClass: "delete",
          handler: async () => {
            if (type == 2) {
              await this.deleteSubCategory(obj);
            } else if (type == 3) {
              await this.deleteInnerCategory(obj);
            }
          },
        },
      ],
    });
    alert.present();
  }

  async deleteSubCategory(sub) {
    console.log(sub);
    await this.firestore.collection("subcategories").doc(sub.id).delete();
    await this.utils.showToast("Sėkmingai pašalintas!", "danger");
  }

  async deleteInnerCategory(inner) {
    await this.firestore.collection("innercategories").doc(inner.id).delete();
    await this.utils.showToast("Sėkmingai pašalintas!", "danger");
  }
}
