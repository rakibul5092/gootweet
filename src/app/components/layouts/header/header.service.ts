import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavigationExtras, Router } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";
import algoliaserch from "algoliasearch";
import { map } from "rxjs/operators";
import { ChatsPage } from "src/app/chats/chats.page";
import { environment } from "../../../../environments/environment";
import { cart, php_api_base, products } from "../../../constants";
import { User } from "../../../models/user";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {
  me: User;
  isLoggedin: boolean = false;
  showSearchBar = new BehaviorSubject(false);
  search;
  suggestionOpen = true;

  userType: string;
  user;
  isMessenger = false;
  newNotification = 0;

  searchText = "";
  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "categories",
  };
  showResult = false;
  searchResult = [];
  sResult = [];

  isFirstTime = true;

  constructor(
    private angularFirestore: AngularFirestore,
    private navController: NavController,
    private popoverController: PopoverController,
    private router: Router,
    private http: HttpClient
  ) {}

  async openChat(event, cssClass = "chat-pop") {
    this.isMessenger = true;
    let popover = await this.popoverController.create({
      component: ChatsPage,
      event: event,
      cssClass: cssClass,
      mode: "ios",
    });

    popover.onDidDismiss().then((value: any) => {
      if (value && value.data) {
      }
      this.isMessenger = false;
    });

    return await popover.present();
  }

  getUnseenCartCount(user: User) {
    return this.angularFirestore
      .collection(cart)
      .doc(user.uid)
      .collection(products, (ref) => ref.where("seen", "==", false));
  }

  enterPress(e) {
    const hit = e.target.value;
    if (hit.length > 0) {
      this.openProduct(hit);
    }
  }

  onSearchByKeyword(event) {
    if (event.target.value.length >= 3) {
      if (event.type == "click") {
        this.suggestionOpen = true;
      }
      this.searchText = event.target.value;
      this.search = event.target.value;

      this.searchResult = [];
      const queries = [
        {
          indexName: "categories",
          query: this.search,
          params: {
            hitsPerPage: 10,
          },
        },
        {
          indexName: "sub_categories",
          query: this.search,
          params: {
            hitsPerPage: 10,
          },
        },
        {
          indexName: "inner_categories",
          query: this.search,
          params: {
            hitsPerPage: 10,
          },
        },
      ];
      this.client = algoliaserch(
        this.searchConfig.appId,
        this.searchConfig.apiKey
      );
      this.index = this.client.initIndex(this.searchConfig.indexName);
      this.client
        .multipleQueries(queries)
        .then(({ results }) => {
          this.searchResult = [];
          results.forEach((result) => {
            result.hits.forEach((hit) => {
              this.searchResult.push(hit);
            });
          });

          this.sResult = this.searchResult;

          if (this.searchResult) {
            this.showResult = true;
            this.suggestionOpen = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.showResult = false;
      // this.searchText = "";
    }
  }

  openProduct(hit) {
    let search_query = hit;
    this.showResult = false;

    let navExtra: NavigationExtras = {
      queryParams: {
        search_query: search_query,
        isProduct: false,
      },
    };
    this.suggestionOpen = false;
    this.navController.navigateForward("search-result", navExtra);
  }

  navigateToMano() {
    this.navController.navigateForward(
      "designer/designer-manufacturer-alphabetically"
    );
  }

  navigateToSetting() {
    this.navController.navigateForward("/designer/designer-general-settings");
  }

  navigateToWallet() {
    this.navController.navigateForward("/designer/designer-wallet");
  }

  clearText() {
    this.search = "";
    this.showResult = false;
  }

  navigateHome() {
    let currentRoute = this.router.url;
    if (currentRoute == "/designer") {
      window.location.reload();
      return;
    }
    this.navController.navigateBack("/");
  }

  getSearchSuggestions(text: string, isAll = false) {
    let formData = new FormData();
    formData.append("search_text", text);
    let url = "";
    if (isAll) {
      url = php_api_base + "all_users.php";
      return this.http
        .get<{ status: boolean; success: boolean; data: any[] }>(url)
        .pipe(
          map((actions) =>
            actions.data.map((a) => {
              return {
                ...a,
                full_name: { first_name: a.first_name, last_name: a.last_name },
              };
            })
          )
        );
    } else {
      url = php_api_base + "user_search.php";
      return this.http
        .post<{ status: boolean; success: boolean; data: any[] }>(url, formData)
        .pipe(
          map((actions) =>
            actions.data.map((a) => {
              return {
                ...a,
                full_name: { first_name: a.first_name, last_name: a.last_name },
              };
            })
          )
        );
    }
  }
}
