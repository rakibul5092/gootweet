import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { MaterialsService } from "src/app/home-main/manufacturer/materials/materials.service";
import { Category, SubCategory } from "../../../models/category";
import { User } from "../../../models/user";
import { getTimestamp, getUser } from "../../../services/functions/functions";

@Component({
  selector: "app-materials-category-popover",
  templateUrl: "./materials-category-popover.page.html",
  styleUrls: ["./materials-category-popover.page.scss"],
})
export class MaterialsCategoryPopoverPage implements OnInit, OnDestroy {
  selectedTab = 1;

  category: Category = {
    id: "",
    data: {
      category: "",
      timestamp: "",
      products_count: 0,
    },
  };
  subCategory: SubCategory = {
    id: "",
    data: {
      sub_category: "",
      timestamp: "",
      category_id: "",
    },
  };
  categories: Category[];
  subCategories: SubCategory[];
  me: User;
  categorySubs: Subscription;
  subsCatSubs: Subscription;
  constructor(
    private modalController: ModalController,
    private service: MaterialsService
  ) {}
  ngOnDestroy(): void {
    if (this.categorySubs) this.categorySubs.unsubscribe();
    if (this.subsCatSubs) this.subsCatSubs.unsubscribe();
  }

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        this.me = user;

        this.categorySubs = this.service
          .getCategories(user.uid)
          .subscribe((query) => {
            this.categories = [];
            query.forEach((item) => {
              let data = item.payload.doc.data();
              this.categories.push({
                id: data.data.category,
                data: {
                  category: data.data.category,
                  timestamp: data.data.timestamp,
                  products_count: data.data.products_count,
                },
              });
            });
          });
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  addCategory() {
    this.category.data.timestamp = getTimestamp();
    if (this.me && this.category.data.category.trim() !== "") {
      this.service.addCategory(this.me.uid, this.category).then(() => {
        this.service.showToast("Pridėta sėkmingai", "primary");
      });
    }
  }
  deleteCategory(category: Category) {
    if (this.me) {
      this.service.deleteCategory(this.me.uid, category).then(() => {
        this.service.showToast("Sėkmingai pašalintas", "danger");
      });
    }
  }

  selectedCategory(category: Category) {
    this.category.data.category = category?.data.category;
    this.category.id = category?.data.category;
    this.category.data.timestamp = category?.data.timestamp;
    this.getSubCategories(this.me.uid);
  }
  // sub category logic here ....................................
  addSubCategory() {
    if (this.me) {
      this.subCategory.data.category_id = this.category?.data.category;
      this.subCategory.data.timestamp = getTimestamp();
      this.service
        .addSubCategory(
          this.me.uid,
          this.category.data.category,
          this.subCategory
        )
        .then(() => {
          this.subCategory.data.sub_category = "";
          this.service.showToast(
            "Sub kategorija pridėta sėkmingai!",
            "success"
          );
        });
    }
  }
  getSubCategories(uid: string) {
    this.subsCatSubs = this.service
      .getSubCategories(uid, this.category.id)
      .subscribe((query) => {
        this.subCategories = [];
        query.forEach((item) => {
          let id = item.payload.doc.id;
          let c = item.payload.doc.data();
          this.subCategories.push({
            id: id,
            data: {
              sub_category: c.data.sub_category,
              timestamp: c.data.timestamp,
              category_id: c.data.category_id,
            },
          });
        });
        if (
          !this.tabFlag &&
          this.subCategories &&
          this.subCategories.length > 0
        ) {
          this.subCategory = {
            id: this.subCategories[0].id,
            data: {
              sub_category: this.subCategories[0].data.sub_category,
              timestamp: this.subCategories[0].data.timestamp,
              category_id: this.subCategories[0].data.category_id,
            },
          };
        } else if (!this.tabFlag) {
          this.selectTab(2);
        }
      });
  }
  deleteSubCategory(subcategory: SubCategory) {
    this.service
      .deleteSubCategory(this.me.uid, this.category.id, this.subCategory.id)
      .then(() => {
        this.service.showToast("Sėkmingai pašalintas!", "danger");
      });
  }

  tabFlag = true;
  selectTab(no: number) {
    if (no == 1) {
      this.selectedTab = no;
      this.category.data.category = "";
      this.tabFlag = true;
    } else if (no == 2) {
      if (this.categories) {
        this.selectedTab = no;
        this.category = {
          id: this.categories[0].id,
          data: {
            category: this.categories[0].data.category,
            timestamp: this.categories[0].data.timestamp,
            products_count: this.categories[0].data.products_count,
          },
        };
        this.tabFlag = true;
        this.subCategory.data.sub_category = "";
        this.getSubCategories(this.me.uid);
      } else {
        this.service.showToast("Kategorijų nėra...", "danger");
      }
    } else if (no == 3) {
      if (this.categories) {
        this.selectedTab = no;
        this.category = {
          id: this.categories[0].id,
          data: {
            category: this.categories[0].data.category,
            timestamp: this.categories[0].data.timestamp,
            products_count: this.categories[0].data.products_count,
          },
        };
        this.tabFlag = false;
        this.getSubCategories(this.me.uid);
      } else {
        this.service.showToast("Kategorijų nėra...", "danger");
      }
    }
  }
}
