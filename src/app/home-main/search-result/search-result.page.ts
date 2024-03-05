import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { IonInfiniteScroll } from "@ionic/angular";
import algoliaserch, { SearchIndex } from "algoliasearch";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { Product } from "src/app/models/product";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { environment } from "../../../environments/environment";
import { HeaderService } from "../../components/layouts/header/header.service";
import { users } from "../../constants";
import { User } from "../../models/user";
import { WalletData } from "../../models/wallet";
import { ScreenService } from "../../services/screen.service";
import { UtilityService } from "../../services/utility.service";
import { WalletService } from "../../services/wallet.service";
import { ProfileService } from "../manufacturer/profile-test/profile.service";
import { LoginService } from "src/app/services/login.service";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.page.html",
  styleUrls: ["./search-result.page.scss"],
})
export class SearchResultPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;

  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  me: User;
  ownerUid: string;

  wallet: WalletData;

  productOwner: User;

  searchText = "";
  client: any;
  index: SearchIndex;
  searchConfig = {
    ...environment.algolia,
    indexName: "products",
  };
  showResult = false;
  searchQuery = "";
  searchResult = [];
  search_query;
  isProduct: boolean = false;
  productIndex;
  nodata = false;
  event: any = IonInfiniteScroll;
  page = 0;
  searchResponse = null;
  category;
  subcategory;
  searchType = "search";
  loaded = false;
  isUserSearch: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private headerService: HeaderService,
    private util: UtilityService,
    private screen: ScreenService,
    private firestore: AngularFirestore,
    private walletService: WalletService,
    public searchPopupService: SearchPopupService,
    private openSingleProductService: OpenSingleProductService,
    public gotoProfileService: GotoProfileService,
    private loginService: LoginService
  ) {}
  gotoProfile(user) {
    user.full_name = {
      first_name: user.first_name ? user.first_name : "",
      last_name: user.last_name ? user.last_name : "",
    };
    this.gotoProfileService.gotoProfile(user);
  }

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      if (user) {
        this.me = user;
        this.userType = user.rule;
        this.userTypeInNumber.next(
          this.userType === "manufacturer" ||
            this.userType === "retailchaincenter"
            ? 1
            : 2
        );
        this.walletService.getWalletData(this.me?.uid).subscribe((query) => {
          this.wallet = query.data() as WalletData;
        });
        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            if (query) {
              let data: any = query.data();
              if (user.rule !== "user") {
                this.me.address = data?.details?.address;
                this.me.profile_photo = data?.profile_photo;
              }
              this.me.full_name = {
                first_name: data?.full_name?.first_name,
                last_name: data?.full_name?.last_name,
              };
            }
          });
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
      }
    });

    this.initSearch();
    if (this.leftBar && this.rightBar) {
      this.leftBar?.classList?.remove("sticky-bar-left");
      this.rightBar?.classList?.remove("sticky-bar-right");
    }
  }
  initSearch() {
    this.loaded = false;
    this.client = algoliaserch(
      this.searchConfig.appId,
      this.searchConfig.apiKey
    );
    this.index = this.client.initIndex(this.searchConfig.indexName);

    this.productIndex = this.client.initIndex("products");

    this.profileService.manufacturer = null;
    this.activatedRoute.queryParams.pipe(first()).subscribe((queryParams) => {
      if (
        queryParams &&
        queryParams.isUserSearch &&
        (queryParams.search_query || queryParams.isAll)
      ) {
        this.searchResult = [];
        this.search_query = queryParams.search_query;
        this.isUserSearch = queryParams.isUserSearch;
        this.headerService
          .getSearchSuggestions(queryParams.search_query, queryParams.isAll)
          .pipe(first())
          .subscribe((res: any) => {
            this.searchResult = res || [];
            this.loaded = true;
            this.headerService.suggestionOpen = false;
          });
      } else {
        if (this.util.isBack) {
          this.util.isBack = false;
          return;
        }
        if (
          queryParams &&
          queryParams.search_query == "" &&
          queryParams.isProduct == true
        ) {
          this.client = algoliaserch(
            this.searchConfig.appId,
            this.searchConfig.apiKey
          );
          this.productIndex = this.client.initIndex("products_title");

          this.productIndex
            .setSettings({
              searchableAttributes: ["title", "product_id"],
            })
            .then(() => {
              this.page = 0;
              this.onSearchProductByKeyword("", 0, this.event);
            });
        }
        if (queryParams && queryParams.search_query) {
          this.search_query = queryParams.search_query;
          this.category = queryParams.category || this.search_query;
          this.subcategory = queryParams.subcategory;
          this.isProduct = JSON.parse(queryParams.isProduct);
          this.headerService.suggestionOpen = false;
          this.showResult = false;
          this.nodata = false;
          this.page = 0;
          this.searchResponse = null;

          if (this.isProduct == false) {
            this.isUserSearch = false;
            if (!this.category && !this.subcategory) {
              this.client = algoliaserch(
                this.searchConfig.appId,
                this.searchConfig.apiKey
              );
              this.index = this.client.initIndex("products");
              this.index
                .setSettings({
                  searchableAttributes: ["catId", "subCatId", "innerCatId"],
                })
                .then(() => {
                  this.onSearchByKeyword(this.search_query);
                });
            }
            if (this.category && this.category != "" && !this.subcategory) {
              this.client = algoliaserch(
                this.searchConfig.appId,
                this.searchConfig.apiKey
              );
              this.index = this.client.initIndex("products");
              this.index
                .setSettings({
                  searchableAttributes: ["catId", "subCatId"],
                })
                .then(() => {
                  this.categoryFilter(this.category, 0, this.event);
                });
            }
            if (this.subcategory && this.subcategory != "" && this.category) {
              this.client = algoliaserch(
                this.searchConfig.appId,
                this.searchConfig.apiKey
              );
              this.index = this.client.initIndex(this.searchConfig.indexName);
              this.index
                .setSettings({
                  searchableAttributes: ["catId", "subCatId"],
                })
                .then(() => {
                  this.categoryAndSubCategoryFilter(
                    this.subcategory,
                    0,
                    this.event
                  );
                });
            }
          } else if (this.isProduct == true) {
            this.client = algoliaserch(
              this.searchConfig.appId,
              this.searchConfig.apiKey
            );
            this.productIndex = this.client.initIndex("products_title");

            this.productIndex
              .setSettings({
                searchableAttributes: ["title", "product_id"],
              })
              .then(() => {
                this.page = 0;
                this.onSearchProductByKeyword(this.search_query, 0, this.event);
              });
          }
        }
      }
    });
  }

  ionViewDidLoad() {
    this.header = document.getElementById("myHeader");
    this.leftBar = document.getElementById("leftBar");
    this.rightBar = document.getElementById("rightBar");
  }

  header: any;
  leftBar: any;
  rightBar: any;
  async initScroll(event) {
    if (this.screen.width.value > 1150) {
      this.header = document.getElementById("myHeader");
      this.leftBar = document.getElementById("leftBar");
      this.rightBar = document.getElementById("rightBar");
      let topSpace = this.header.offsetTop;
      if (event.detail.scrollTop > topSpace) {
        this.leftBar?.classList?.add("sticky-bar-left");
        if (this.rightBar) {
          this.rightBar?.classList?.add("sticky-bar-right");
        }
      } else {
        this.leftBar?.classList?.remove("sticky-bar-left");

        if (this.rightBar) {
          this.rightBar?.classList?.remove("sticky-bar-right");
        }
      }
    } else {
      if (this.rightBar) {
        this.rightBar?.classList?.remove("sticky-bar-right");
      }
    }
  }

  ngOnDestroy(): void {
    this.profileService.destroy();
  }

  onSearchByKeyword(title) {
    this.loaded = false;
    this.loaded = false;
    if (title.length !== 0) {
      this.index
        .setSettings({
          searchableAttributes: [
            "catId",
            "subCatId",
            "innerCatId",
            "title",
            "product_id",
          ],
        })
        .then(async () => {
          this.index
            .search(title, {
              filters: `price:${this.searchPopupService.min} TO ${this.searchPopupService.max}`,
            })

            .then(({ hits }) => {
              this.searchResult = [];
              this.searchResult = hits;
              if (this.searchResult.length > 0) {
                this.showResult = true;
                this.nodata = false;
              } else {
                this.nodata = true;
                this.showResult = false;
              }
              this.loaded = true;
            })
            .catch(async (err) => {
              this.loaded = true;
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("category wise product search error: ", err);
        });
    } else {
      this.showResult = false;
    }
  }

  // onSearchByKeyword(event) {
  //   if (event.target.value.length !== 0) {

  //     this.index.search(event.target.value)

  //       .then(({ hits }) => {
  //         // console.log(hits[0].uid, this.manufacturerId);

  //         this.searchResult = [];
  //         this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
  //         if(this.searchResult){
  //           this.showResult = true;
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } else {
  //     this.showResult = false;
  //   }
  // }

  async openSingleProduct(uid, id) {
    this.loaded = false;
    this.profileService
      .getSingleProduct(uid, id)
      .get()
      .pipe(first())
      .subscribe(async (query) => {
        if (query) {
          let pro: Product = query.data() as Product;
          this.profileService
            .getProductOwner(uid)
            .get()
            .pipe(first())
            .subscribe(async (ownerData) => {
              this.productOwner = ownerData.data() as User;
              this.openSingleProductService.openSingleProduct(
                pro,
                this.productOwner
              );
              this.loaded = true;

              //Due to the open product page below code is commented out
              /*if (this.me && this.me?.rule === "designer") {
                  this.injector
                    .get<ChatService>(ChatService)
                    .openProduct(id, pro, this.productOwner.uid, false);
                } else {
                  this.util.openSingleProduct(pro, this.productOwner);
                }*/
            });
        }
      });
    this.showResult = false;
  }

  onSearchProductByKeyword(title, page, event, from = "enter") {
    this.loaded = false;
    if (true) {
      this.page = page;

      if (
        this.searchResponse &&
        this.searchResponse.page >= this.searchResponse.nbPages &&
        from == "scroll"
      ) {
        event.target.complete();
        return;
      }

      if (this.subcategory && this.subcategory != "") {
        this.productIndex
          .search(title, {
            page: page,
            hitsPerPage: 20,
          })
          .then((response) => {
            this.searchResponse = response;
            // console.log(hits[0].uid, this.manufacturerId);

            // this.searchResult = [];
            // this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
            if (this.page == 0) {
              this.searchResult = response.hits;
            } else {
              this.searchResult = [...this.searchResult, ...response.hits];
            }
            if (this.searchResult.length > 0) {
              this.showResult = true;
              this.nodata = false;
              this.page = page;
            } else {
              this.showResult = false;
              this.nodata = true;
            }

            if (this.page > 0) {
              setTimeout(async () => {
                event.target.complete();
              }, 100);
            }
            this.loaded = true;
          })
          .catch((err) => {
            this.loaded = true;
            console.log(err);
          });
      } else if (this.category && this.category != "") {
        this.productIndex
          .search(title, {
            page: page,
            hitsPerPage: 20,
          })
          .then((response) => {
            this.searchResponse = response;
            // console.log(hits[0].uid, this.manufacturerId);

            // this.searchResult = [];
            // this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
            if (this.page == 0) {
              this.searchResult = response.hits;
            } else {
              this.searchResult = [...this.searchResult, ...response.hits];
            }
            if (this.searchResult.length > 0) {
              this.showResult = true;
              this.nodata = false;
              this.page = page;
            } else {
              this.showResult = false;
              this.nodata = true;
            }
            this.loaded = true;
            if (this.page > 0) {
              setTimeout(async () => {
                event.target.complete();
              }, 100);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log(
          "title",
          title,
          this.searchPopupService.min,
          this.searchPopupService.max
        );

        this.productIndex
          .search(title, {
            page: page,
            hitsPerPage: 20,
            filters: `price:${this.searchPopupService.min} TO ${this.searchPopupService.max}`,
          })
          .then((response) => {
            this.searchResponse = response;
            // console.log(hits[0].uid, this.manufacturerId);

            // this.searchResult = [];
            // this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
            if (this.page == 0) {
              this.searchResult = response.hits;
            } else {
              this.searchResult = [...this.searchResult, ...response.hits];
            }
            if (this.searchResult.length > 0) {
              this.showResult = true;
              this.nodata = false;
              this.page = page;
            } else {
              this.showResult = false;
              this.nodata = true;
            }
            this.loaded = true;
            if (this.page > 0) {
              setTimeout(async () => {
                event.target.complete();
              }, 100);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      this.showResult = false;
    }
  }

  categoryFilter(title, page, event, from = "enter") {
    this.loaded = false;
    if (title.length !== 0) {
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
        .setSettings({
          searchableAttributes: ["catId", "subCatId"],
        })
        .then(async () => {
          this.index
            .search(title, {
              page: page,
              hitsPerPage: 20,
              filters: `price:${this.searchPopupService.min} TO ${this.searchPopupService.max}`,
            })

            .then((response) => {
              this.searchResponse = response;

              // this.searchResult = [];
              if (this.page == 0) {
                this.searchResult = response.hits;
              } else {
                this.searchResult = [...this.searchResult, ...response.hits];
              }
              // this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
              // this.searchResult = response.hits;
              if (this.searchResult.length > 0) {
                this.showResult = true;
                this.nodata = false;
                this.page = page;
                this.searchType = "filter";
              } else {
                this.showResult = false;
                this.nodata = true;
              }

              if (this.page > 0) {
                setTimeout(async () => {
                  event.target.complete();
                }, 100);
              }
              this.loaded = true;
            })
            .catch(async (err) => {
              this.loaded = true;
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("category wise product search error: ", err);
        });
    } else {
      this.showResult = false;
    }
  }

  categoryAndSubCategoryFilter(title, page, event, from = "enter") {
    this.loaded = false;
    if (title.length !== 0) {
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
        .setSettings({
          searchableAttributes: ["catId", "subCatId"],
        })
        .then(async () => {
          this.index
            .search(title, {
              page: page,
              hitsPerPage: 20,
              filters: `price:${this.searchPopupService.min} TO ${this.searchPopupService.max}`,
            })
            .then((response) => {
              this.searchResponse = response;
              this.util.dismiss().then(() => {
                // console.log(hits[0].uid, this.manufacturerId);

                if (this.page == 0) {
                  this.searchResult = response.hits;
                } else {
                  this.searchResult = [...this.searchResult, ...response.hits];
                }
                // this.searchResult = hits.filter((item)=>{return item.uid == this.ownerUid});
                // this.searchResult = response.hits;
                if (this.searchResult.length > 0) {
                  this.showResult = true;
                  this.nodata = false;
                  this.page = page;
                  this.searchType = "filter2";
                } else {
                  this.showResult = false;
                  this.nodata = true;
                }
                this.loaded = true;
                if (this.page > 0) {
                  setTimeout(async () => {
                    event.target.complete();
                  }, 100);
                }
              });
            })
            .catch(async (err) => {
              this.loaded = true;
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("category wise product search error: ", err);
        });
    } else {
      this.showResult = false;
    }
  }
}
