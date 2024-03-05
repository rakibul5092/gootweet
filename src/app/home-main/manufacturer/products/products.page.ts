import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { NavigationExtras } from "@angular/router";
import {
  AlertController,
  IonInfiniteScroll,
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import algoliaserch from "algoliasearch";
import { first } from "rxjs/operators";
import { CategoryFilterPage } from "src/app/components/popovers/category-filter/category-filter.page";
import { getUser } from "src/app/services/functions/functions";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { environment } from "../../../../environments/environment";
import { commissions, products } from "../../../constants";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";
import { User } from "../../../models/user";
import { AwsUploadService } from "../../../services/aws-upload.service";
import { UtilityService } from "../../../services/utility.service";
import { ApiInstructionsPage } from "./api-instructions/api-instructions.page";
import { PaginationService } from "./pagination.service";
import { ProductsService } from "./products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"],
})
export class ProductsPage implements OnInit {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  me: User;
  products: Product[];
  categories: Category[];
  commission: number;

  selectedCategoryId: string;
  moreProducts: Product[] = [];
  startAfter: QueryDocumentSnapshot<any>;

  subCategoryName: string;
  searchText;
  showResult = false;
  searchQuery = "";
  searchResult = [];
  page = 0;
  searchResponse;
  nodata = false;

  type: string;
  searchType;
  event: IonInfiniteScroll;
  activeType = "product";
  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "products_title",
  };

  searchProducts: Product[] = [];

  constructor(
    public service: ProductsService,
    private nav: NavController,
    private alertController: AlertController,
    private util: UtilityService,
    private popoverController: PopoverController,
    private firestore: AngularFirestore,
    private awsService: AwsUploadService,
    private modalController: ModalController,
    public openSingleProductService: OpenSingleProductService,
    public pageS: PaginationService
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      this.me = user;
      this.pageS.init(products, this.me.uid);
      this.pageS.data.subscribe((prods) => {
        this.products = prods;
      });
      this.profileCheckEvent.emit(true);
      this.service.me = user;
      this.getCategories();
    });

    this.client = algoliaserch(
      this.searchConfig.appId,
      this.searchConfig.apiKey
    );
    this.index = this.client.initIndex(this.searchConfig.indexName);
  }

  changeCommission(e) {
    this.commission = e.target.value;
  }

  saveCommission(category) {
    if (+this.commission > 4) {
      this.firestore
        .collection(commissions)
        .doc(this.me.uid)
        .collection(commissions)
        .doc(category.id)
        .set({ commission: this.commission }, { merge: true })
        .then(() => {
          this.service.showToast("Commission added", "success");
          this.firestore
            .collection(commissions)
            .doc(this.me.uid)
            .collection(commissions)
            .get()
            .pipe(first())
            .subscribe((query) => {
              let avgCommission = 0;
              query.forEach((item) => {
                avgCommission = avgCommission + +item.data().commission;
              });
              avgCommission = avgCommission / query.docs.length;
              this.firestore
                .collection(commissions)
                .doc(this.me.uid)
                .set({ averageCommission: avgCommission });
            });
        });
    } else {
      this.service.showToast("Minimum commission should be 5", "danger");
    }
  }

  openSetting(pid: string) {
    const navExtra: NavigationExtras = {
      queryParams: {
        pid: pid,
        uid: this.me.uid,
      },
    };
    this.nav.navigateForward("insert", navExtra);
  }

  getCategories() {
    this.service
      .getCategories()
      .pipe(first())
      .subscribe((cats) => {
        this.categories = cats;
        // query.forEach((item) => {
        //   let id = item.id;
        //   let data = item.data() as CategoryData;
        //   this.categories.push({
        //     id: id,
        //     data: data
        //   });
        // this.firestore
        //   .collection(commissions)
        //   .doc(this.me.uid)
        //   .collection(commissions)
        //   .doc(id)
        //   .get()
        //   .pipe(first())
        //   .subscribe((commQuery) => {
        //     let commission = commQuery.data();

        //   });
        // });
      });
  }

  loadMoreProducts(event) {
    this.pageS.more();
    setTimeout(async () => {
      event.target.complete();
    }, 100);
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
              } else {
                this.searchResult = [...this.searchResult, ...response.hits];
                if (this.searchResult) {
                  this.activeType == "search";
                  this.searchType == "product_id";
                  response.hits.forEach((result) => {
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
              }

              if (this.searchResult.length > 0) {
                this.showResult = true;
                this.nodata = false;
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

  async openFilterPopup() {
    let popover = await this.modalController.create({
      component: CategoryFilterPage,
      cssClass: "category-filter",
      mode: "ios",
      backdropDismiss: true,
      animated: true,
      swipeToClose: true,
    });

    popover.onDidDismiss().then((value: any) => {
      if (value && value.data) {
      }
    });
    return await popover.present();
  }

  async askPermissionForDelete(i: number, product: Product) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Confirmation!!!",
      message: "Are you sure want to delete?",
      mode: "ios",
      buttons: [
        {
          text: "cancel",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Delete",
          handler: () => {
            this.products.splice(i, 1);
            this.removeProduct(product);
          },
        },
      ],
    });
    alert.present();
  }

  async removeProduct(product: Product) {
    let images = [];
    if (product.aditional_images.length > 0) {
      product.aditional_images.forEach((pai) => {
        images.push(pai);
      });
    }
    if (product.main_images.length > 0) {
      product.main_images.forEach((pmi) => {
        images.push(pmi);
      });
    }

    this.awsService.removeImages("product_photos", images);
    await this.service
      .deleteProduct(this.me.uid, product.id, product)
      .then(async () => {
        await this.service.showToast("Product delete successfully", "danger");
      });
  }

  // product popup function starts here
  async openProduct(event: any, product: Product, productOwner) {
    this.openSingleProductService.openSingleProduct(product, productOwner);
  }

  async openApiInstructions() {
    const popover = await this.popoverController.create({
      component: ApiInstructionsPage,
      animated: true,
      backdropDismiss: true,
      cssClass: "api-instructions",
      keyboardClose: true,
      mode: "ios",
    });

    return await popover.present();
  }

  copyMessage(uid: string, pId: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    let url = "https://gootweet.com/conversation?uid=" + uid + "&pid=" + pId;
    selBox.value = `<button style="padding: 5px 35px;cursor: pointer;background: #6a7bff;
    color: #fff;border-radius: 50px;font-weight: 700;
    border: 1px solid transparent;line-height: 1.5;" onclick="location.href='${url}';">Test</button>`;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.util.showToast("Copied", "success");
  }
}
