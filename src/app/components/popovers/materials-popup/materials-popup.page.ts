import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { materials } from "../../../constants";
import {
  Category,
  CategoryData,
  SubCategory,
  SubCategoryData,
} from "../../../models/category";
import { Material } from "../../../models/material";
import { User } from "../../../models/user";
import algoliaserch from "algoliasearch";
import { environment } from "../../../../environments/environment";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { getUser } from "src/app/services/functions/functions";
import { MaterialsService } from "src/app/home-main/manufacturer/materials/materials.service";
import { first } from "rxjs/operators";
import { Subscription } from "rxjs";

interface MaterialExtra extends Material {
  selected: boolean;
  price: string;
}
@Component({
  selector: "app-materials-popup",
  templateUrl: "./materials-popup.page.html",
  styleUrls: ["./materials-popup.page.scss"],
})
export class MaterialsPopupPage implements OnInit, OnDestroy {
  materials: MaterialExtra[];
  selectedMaterials: MaterialExtra[];
  categories: Category[];
  category: Category = {
    id: "",
    data: {
      category: "Choose category",
      timestamp: "",
      products_count: 0,
    },
  };
  subCategories: SubCategory[];
  subCategory: SubCategory = {
    id: "",
    data: {
      sub_category: "Choose sub-category",
      timestamp: "",
      category_id: "",
    },
  };
  me: User;
  searchText = "";
  type = "firebase";
  page = 0;

  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "materials",
  };
  showResult = false;
  searchQuery = "";
  searchResult = [];
  searchResponse;
  categoryName: string = "disabled";
  subCategoryName: string = "disabled";

  matCatSubs: Subscription;
  matByCatSubs: Subscription;
  matByCatSubCatSubs: Subscription;
  subCatSubs: Subscription;

  constructor(
    private modalController: ModalController,
    public matService: MaterialsService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      this.me = user;
      this.client = algoliaserch(
        this.searchConfig.appId,
        this.searchConfig.apiKey
      );
      this.index = this.client.initIndex(this.searchConfig.indexName);
      this.matService.getMaterials(this.me?.uid);
      this.matCatSubs = this.matService
        .getCategories(user.uid)
        .subscribe((query) => {
          this.categories = [];
          query.forEach((item) => {
            const id = item.payload.doc.id;
            const data: any = item.payload.doc.data() as CategoryData;
            this.categories.push({
              id: id,
              data: data.data,
            });
          });
        });
    });
  }

  findNext(event) {
    this.matService.getMaterials(this.me?.uid);
    setTimeout(async () => {
      event.target.complete();
    }, 2000);
  }

  onSearchByKeyword(event, page = 0, from = "call") {
    if (this.searchText.length !== 0) {
      this.page = page;
      if (
        this.searchResponse &&
        this.searchResponse.page >= this.searchResponse.nbPages &&
        from == "scroll"
      ) {
        event.target.complete();
        return;
      }
      this.index
        .search(this.searchText, {
          page: page,
          hitsPerPage: 10,
        })
        .then((response) => {
          this.searchResponse = response;
          if (response.hits) {
            this.type = "search";
          } else {
            this.type = "firebase";
          }

          if (this.page == 0) {
            this.searchResult = response.hits;
            this.matService.materials = [];
          } else {
            this.searchResult = [...this.searchResult, ...response.hits];
          }
          this.searchResult = response.hits.filter((item) => {
            return item.uid == this.me?.uid;
          });
          if (this.searchResult) {
            this.showResult = true;

            this.searchResult.forEach((i) => {
              this.firestore
                .collection(materials)
                .doc(this.me?.uid)
                .collection(materials)
                .doc(i.objectID)
                .get()
                .pipe(first())
                .subscribe((query) => {
                  if (query.data()) {
                    let mat: Material = query.data() as Material;
                    this.matService.materials.push({
                      category: mat.category,
                      code: mat.code,
                      id: mat.id,
                      images: mat.images,
                      name: mat.name,
                      price: "",
                      selected: false,
                      sub_category: mat.sub_category,
                      timestamp: mat.timestamp,
                    });
                  }
                });
            });
            if (this.page > 0) {
              setTimeout(async () => {
                event.target.complete();
              }, 100);
            }
          }
          // this.matService.materials = hits;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.matService.getMaterialsCalled = false;
      this.matService.startAfter = null;
      this.matService.materials = [];
      this.matService.getMaterials(this.me.uid);
      this.showResult = false;
    }
  }

  ngOnDestroy() {
    this.matService.destroy();
    if (this.matCatSubs) this.matCatSubs.unsubscribe();
    if (this.matByCatSubs) this.matByCatSubs.unsubscribe();
    if (this.matByCatSubCatSubs) this.matByCatSubCatSubs.unsubscribe();
    if (this.subCatSubs) this.subCatSubs.unsubscribe();
  }

  openSingleMaterial(uid, objectId) {
    this.matService
      .opentSingleMaterial(uid, objectId)
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query) {
          let singleMat = query.data() as MaterialExtra;
          this.matService.materials = [];
          this.matService.materials.push(singleMat);
          this.showResult = false;
        }
      });
  }

  materialAddFromQuery(query: any) {
    query.forEach((item) => {
      const id = item.payload.doc.id;
      const material: any = item.payload.doc.data();

      this.matService.materials.push({
        category: material?.category,
        sub_category: material?.sub_category,
        code: material.code,
        id: id,
        images: material?.images,
        name: material?.name,
        timestamp: material?.timestamp,
        selected: false,
        price: "",
      });
    });
  }

  onSelectCategory() {
    if (this.me.uid && this.categoryName && this.categoryName != "disabled") {
      this.category = {
        data: {
          category: this.categoryName,
          timestamp: "",
          products_count: 0,
        },
        id: this.categoryName,
      };
      this.matService.materials = [];
      this.selectedMaterials = [];
      this.matService.startAfter = null;
      this.matByCatSubs = this.matService
        .getMaterialsByCategory(this.me.uid, this.category.id)
        .subscribe((query) => {
          this.materialAddFromQuery(query);
        });
      this.getSubCategories(this.me.uid, this.category.id);
    } else {
      this.matService.materials = [];
      this.selectedMaterials = [];
      this.matService.startAfter = null;
      this.matService.getMaterials(this.me.uid);
    }
  }

  onSelectedSubCategory() {
    if (
      this.me.uid &&
      this.categoryName &&
      this.categoryName != "disabled" &&
      this.subCategoryName &&
      this.subCategoryName != "disabled"
    ) {
      this.matService.materials = [];
      this.selectedMaterials = [];
      this.matService.startAfter = null;
      this.matByCatSubCatSubs = this.matService
        .getMaterialsByCategorySubcategory(
          this.me.uid,
          this.categoryName,
          this.subCategoryName
        )
        .subscribe((query) => {
          this.materialAddFromQuery(query);
        });
    }
  }

  getSubCategories(uid: string, catId: string) {
    this.subCatSubs = this.matService
      .getSubCategories(uid, catId)
      .subscribe((query) => {
        this.subCategories = [];
        query.forEach((item) => {
          const id = item.payload.doc.id;
          const data: any = item.payload.doc.data() as SubCategoryData;
          this.subCategories.push({
            id: id,
            data: data.data,
          });
        });
      });
  }

  addMaterials() {
    this.modalController.dismiss(this.selectedMaterials);
  }
  close() {
    this.modalController.dismiss();
  }

  async checkMaterial(i: number, selected: boolean, matId: string) {
    if (!this.selectedMaterials) {
      this.selectedMaterials = [];
    }
    this.matService.materials[i].selected = !selected;
    if (!selected) {
      this.selectedMaterials.push(this.matService.materials[i]);
    } else {
      this.selectedMaterials.forEach((item, index) => {
        if (item.id == matId) {
          this.selectedMaterials.splice(index, 1);
        }
      });
    }
  }

  // after select a category from jquery .........................

  // category selection initilization for jquery to work click event .........................
}
