import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { IonInfiniteScroll, ModalController, NavParams } from "@ionic/angular";
import algoliaserch from "algoliasearch";
import { first } from "rxjs/operators";
import { AdvanceSearchService } from "src/app/home-main/advance-search/advance-search.service";
import { environment } from "../../../../environments/environment";
import { categories, lazyImage, products } from "../../../constants";
import {
  CategoryData,
  CategoryForProductAdd,
  SubCategoryForProductAdd,
} from "../../../models/category";
import { NormalGood, Product, VariationGood } from "../../../models/product";
import { ProductSelectService } from "./product-select.service";
import { ScreenService } from "src/app/services/screen.service";

interface ProdcuctWithSelected extends Product {
  isSelected: boolean;
}
@Component({
  selector: "app-products-six-popup",
  templateUrl: "./products-six-popup.page.html",
  styleUrls: ["./products-six-popup.page.scss"],
})
export class ProductsSixPopupPage implements OnInit {
  selectedProducts: Product[];
  myUid: string;
  categories: CategoryForProductAdd[];
  searchText: string = "";
  searchResult;
  default = lazyImage;

  products: ProdcuctWithSelected[] = [];
  startAfter: QueryDocumentSnapshot<any>;
  isSelectCategoryOrSubCategory: boolean = false;
  category: CategoryForProductAdd;
  subcategory: SubCategoryForProductAdd;

  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "products_title",
  };
  type = "load_products";
  category_filter;
  event: IonInfiniteScroll;
  page = 0;

  constructor(
    private modalController: ModalController,
    private service: ProductSelectService,
    private navParams: NavParams,
    private firestore: AngularFirestore,
    public advanceSearchService: AdvanceSearchService,
    public screen: ScreenService
  ) {}

  ngOnInit() {
    this.client = algoliaserch(
      this.searchConfig.appId,
      this.searchConfig.apiKey
    );

    this.index = this.client.initIndex(this.searchConfig.indexName);
    this.selectedProducts = [];
    if (this.navParams.data) {
      this.myUid = this.navParams.get("uid");

      if (this.myUid) {
        this.advanceSearchService.getCategories(this.myUid);
        this.getProducts(this.myUid);
      }
    }
  }

  onSelectCategoryOrSubCategory(
    event,
    category: string,
    cat_id: string,
    sub: SubCategoryForProductAdd,
    from = "call"
  ) {
    this.clearText();
    this.type = "category_filter";
    this.category_filter = cat_id;

    this.advanceSearchService.categoriesForShow.forEach((c) => {
      if (c.category !== category) {
        c.isSelected = false;
      }
      if (c.category == category) {
        c.isSelected = true;
      }
    });
    this.firestore
      .collection(categories)
      .doc(cat_id)
      .get()
      .pipe(first())
      .subscribe((query) => {
        this.category = {
          data: query.data() as CategoryData,
          id: query.id,
          isSelected: false,
          subCategories: null,
        };
        this.subcategory = sub;

        if (from == "call") {
          this.products = [];
          this.startAfter = undefined;
        }
        this.getProductsByCategories(this.category, sub);
        if (from == "scroll" && event && event?.target) {
          setTimeout(() => {
            event.target.complete();
          }, 1000);
        }
      });
  }

  getProductsByCategories(
    cat: CategoryForProductAdd,
    sub: SubCategoryForProductAdd
  ) {
    if (cat && sub == null) {
      cat.isSelected = !cat.isSelected;
      if (cat.isSelected) {
        this.service
          .getProductsByCategory(this.myUid, cat.id, this.startAfter)
          .pipe(first())
          .subscribe((query) => {
            // this.products = [];
            this.productQueryExecution(query);
          });
      } else {
        this.getProducts(this.myUid);
      }
    }
    if (sub != null) {
      sub.isSelected = !sub.isSelected;
      if (sub.isSelected) {
        this.service
          .getProductsByCategorySubCategory(
            this.myUid,
            cat.id,
            sub.id,
            this.startAfter
          )
          .pipe(first())
          .subscribe((query) => {
            this.productQueryExecution(query);
          });
      } else {
        this.getProducts(this.myUid);
      }
    }
  }

  getProducts(uid: string) {
    this.service
      .getAllProducts(uid, this.startAfter)
      .pipe(first())
      .subscribe((query) => {
        this.productQueryExecution(query);
      });
  }

  productQueryExecution(query: any) {
    if (query && query.docs.length > 0) {
      this.startAfter = query.docs[
        query.docs.length - 1
      ] as QueryDocumentSnapshot<any>;
    }
    query.forEach((item) => {
      let id = item.id;
      let data = item.data();
      let product: ProdcuctWithSelected = {
        id: id,
        product_id: data?.product_id,
        title: data.title,
        category: data.category,
        sub_category: data.sub_category,
        inner_category: data.inner_category,
        good: data.good,
        description: data.description,
        main_images: data.main_images,
        measures: data.measures,
        delivery_types: data.delivery_types,
        delivery_time: data?.delivery_time ? data?.delivery_time : "",
        commision: data.commision,
        isSelected: false,
        timestamp: data?.timestamp,
        aditional_images: data?.aditional_images,
      };
      this.products.push(product);
    });
  }

  loadProducts(event) {
    if (this.isSelectCategoryOrSubCategory) {
      this.getProductsByCategories(this.category, this.subcategory);
    } else {
      this.getProducts(this.myUid);
    }
    setTimeout(async () => {
      event.target.complete();
    }, 100);
  }

  close() {
    this.modalController.dismiss();
  }
  onSearchByKeyword(event, page, searchText, from = "call") {
    this.page = page;
    if (this.searchText.trim().length > 0) {
      if (this.searchText.length > 2) {
        this.type = "product_title";

        this.index
          .setSettings({
            searchableAttributes: ["title", "product_id"],
            attributesForFaceting: ["uid"],
          })
          .then(() => {
            this.index
              .search(this.searchText, {
                page: page,
                hitsPerPage: 20,
                filters: `uid:${this.myUid}`,
              })

              .then((response) => {
                if (this.page == 0 && response.page <= response.nbPages) {
                  // this.searchResult = [];
                  this.searchResult = response.hits;
                  if (this.searchResult) {
                    this.products = [];
                    this.products = this.searchResult.map((item) => {
                      return { ...item.original_data, isSelected: false };
                    });
                  }
                } else {
                  const tempData = response.hits.map((item) => {
                    return { ...item.original_data, isSelected: false };
                  });
                  this.products = [...this.products, ...tempData];
                }

                if (from == "scroll" && event && event?.target) {
                  setTimeout(() => {
                    event.target.complete();
                  }, 1000);
                }
                // this.products = hits;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      this.type = "load_products";
      this.page = 0;
      if (this.products.length < 1) {
        this.getProducts(this.myUid);
      }
    }
  }
  async checkProduct(product: ProdcuctWithSelected) {
    product.isSelected = !product.isSelected;
    if (product.isSelected) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.forEach((item, index) => {
        if (item.id == product.id) {
          this.selectedProducts.splice(index, 1);
        }
      });
    }
  }
  dismiss() {
    this.modalController.dismiss(this.selectedProducts);
  }
  getId(good: VariationGood | NormalGood) {
    let id = "";
    if (Array.isArray(good)) {
      id = good[0].code;
    }
    return id;
  }
  clearText(loadProducts = "no") {
    this.searchText = "";
    this.page = 0;
    this.type = "load_products";
    if (loadProducts == "load") {
      this.getProducts(this.myUid);
    }
  }
}
