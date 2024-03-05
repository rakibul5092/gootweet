import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { ModalController, ToastController } from "@ionic/angular";
import { categories, products, users } from "../../../constants";
import { CategoryWithProduct, Product } from "../../../models/product";
import algoliaserch from "algoliasearch";
import { environment } from "../../../../environments/environment";
import { User } from "src/app/models/user";
import { first, map } from "rxjs/operators";
import { CategoryData } from "src/app/models/category";
import { combineLatest } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  isFilter: boolean = false;
  isMoreProduct = false;
  categoryName: string;
  categories: CategoryWithProduct[];
  searchText: string;
  searchType;
  me: User;

  page = 0;
  searchResponse;
  activeType = "product";
  searchProducts: Product[] = [];
  searchResult = [];
  nodata = false;
  showResult = false;

  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "products_title",
  };

  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private modalController: ModalController // private awsRemoveService: AwsRemoveService,
  ) {}

  getCategories() {
    return this.firestore
      .collection<CategoryData>(categories, (ref) =>
        ref
          .orderBy("product_count")
          .orderBy("timestamp", "desc")
          .where("product_count", ">", 0)
      )
      .get()
      .pipe(
        map((actions) => {
          return actions.docs.map((a) => {
            return {
              id: a.id,
              data: a.data() as CategoryData,
            };
          });
        })
      );
  }

  getProducts(uid: string, startAfter: QueryDocumentSnapshot<any>) {
    if (startAfter) {
      return this.firestore
        .collection(products)
        .doc(uid)
        .collection(products, (ref) => ref.startAfter(startAfter).limit(20))
        .get();
    }
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(products, (ref) => ref.limit(20))
      .get();
  }

  getProductById(myUid: string, product_id: string) {
    return this.firestore
      .collection(products)
      .doc(myUid)
      .collection(products)
      .doc(product_id)
      .get();
  }

  getProductWithOwnerInfo(ownerUid: string, productId: string) {
    return combineLatest([
      this.firestore.collection(users).doc(ownerUid).get(),
      this.firestore
        .collection(products)
        .doc(ownerUid)
        .collection(products)
        .doc(productId)
        .get(),
    ]);
  }

  async deleteProduct(myUid: string, pId: string, product: Product) {
    return this.firestore
      .collection(products)
      .doc(myUid)
      .collection(products)
      .doc(pId)
      .delete();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      animated: true,
      duration: 1000,
      mode: "ios",
      color: color,
    });
    await toast.present();
  }

  filterWithCategory(category, event) {
    if (event.target.checked) {
      this.isFilter = true;
      this.isMoreProduct = false;
      this.categoryName = category;
      // this.subCategoryName = "";
    } else {
      this.isFilter = false;
      this.isMoreProduct = false;
      this.categoryName = "";
      // this.subCategoryName = "";
    }
    this.modalController.dismiss();
  }

  onSearchByKeyword(val, page, event, from) {
    this.searchText = val;
    this.searchType = "product_id";

    if (val.length !== 0) {
      this.page = page;
      if (
        this.searchResponse &&
        this.searchResponse.page >= this.searchResponse.nbPages &&
        from == "scroll"
      ) {
        event.target.complete();
        return;
      }

      this.activeType = "search";
      this.client = algoliaserch(
        this.searchConfig.appId,
        this.searchConfig.apiKey
      );
      this.index = this.client.initIndex(this.searchConfig.indexName);
      this.index
        .setSettings({
          searchableAttributes: ["title", "product_id"],
          attributesForFaceting: ["uid"],
        })
        .then(() => {
          this.index
            .search(val, {
              page: page,
              hitsPerPage: 10,
              filters: `uid:${this.me.uid}`,
            })

            .then((response) => {
              this.searchResponse = response;
              if (this.page == 0) {
                this.searchResult = response.hits;
                this.searchProducts = [];
                if (this.searchResult) {
                  this.activeType == "search";
                  this.searchType == "product_id";
                  this.searchResult.forEach((result) => {
                    this.firestore
                      .collection(products)
                      .doc(this.me.uid)
                      .collection(products)
                      .doc(result.objectID)
                      .get()
                      .pipe(first())
                      .subscribe((query) => {
                        if (query) {
                          let product: Product = query.data() as Product;
                          product.id = query.id;
                          this.searchProducts.push(product);
                        }
                      });
                  });
                }

                if (this.page > 0 || from == "scroll") {
                  setTimeout(async () => {
                    event.target.complete();
                  }, 100);
                }
              }

              if (this.searchResult.length > 0) {
                this.showResult = true;
                this.nodata = false;
                this.modalController.dismiss();
              } else {
                this.showResult = false;
                this.nodata = true;
              }

              if (this.page > 0 || from == "scroll") {
                setTimeout(async () => {
                  event.target.complete();
                }, 100);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
    } else {
      this.showResult = false;
      this.activeType = "";
      this.searchType = "";
    }
  }
}
