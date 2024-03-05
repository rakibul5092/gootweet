import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuController, ModalController, NavController } from "@ionic/angular";
import algoliasearch from "algoliasearch/lite";
import { InstantSearchConfig } from "angular-instantsearch/instantsearch/instantsearch";
import { Observable, Subscription } from "rxjs";
import { ProductFilterService } from "src/app/components/home-page/sub-category/product-filter.service";
import { BottomNavService } from "src/app/components/layouts/bottom-nav/bottom-nav.service";
import {
  SUB_CATEGORY_IMAGE_BASE,
  selectedCategoryID,
  selectedSubcategoryID,
} from "src/app/constants";
import { ScreenService } from "src/app/services/screen.service";
import { environment } from "src/environments/environment";
import { InnerCategory } from "src/app/models/category";
import { SubCategoryFilterPopupPage } from "../../sub-category-filter-popup/sub-category-filter-popup.page";
import { FilterService } from "../filter.service";
import { isPlatformBrowser } from "@angular/common";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.page.html",
  styleUrls: ["./sub-category.page.scss"],
})
export class SubCategoryPage implements OnInit, OnDestroy {
  subcatImageBase = SUB_CATEGORY_IMAGE_BASE;
  isQuickView = false;
  results: Observable<any>;
  config: InstantSearchConfig = {
    indexName: "products_title",
    searchClient: algoliasearch(
      environment.algolia.appId,
      environment.algolia.apiKey
    ),
  };
  placeholder = "Search";
  suggestions = false;
  subs: Subscription;
  innerClickSubs: Subscription;
  selectedInnerCategories: InnerCategory[] = [];
  searchText = "";
  isInnerMenu = false;
  constructor(
    private screen: ScreenService,
    private categoryService: SearchPopupService,
    private modalController: ModalController,
    private nav: NavController,
    public productFilterService: ProductFilterService,
    private route: ActivatedRoute,
    private navService: BottomNavService,
    private menuCtrl: MenuController,
    private filterService: FilterService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
    this.innerClickSubs?.unsubscribe();
  }
  onBlur() {
    setTimeout(() => {
      this.suggestions = false;
    }, 100);
  }
  ngOnInit() {
    this.productFilterService.searching = false;
    this.productFilterService.initSearch("products", 20, "", false);
    this.productFilterService.page = 0;
    this.results = this.productFilterService.searchResult;
    this.route.params.subscribe((res) => {
      if (res && res.id && res.id !== "all") {
        this.productFilterService.searching = true;
        this.productFilterService.initQuery(res.id);
        setTimeout(() => {
          this.productFilterService.onFilter();
        }, 100);
        if (isPlatformBrowser(this.platformId)) {
          const catID = localStorage.getItem(selectedCategoryID);
          const subCatID = localStorage.getItem(selectedSubcategoryID);
          this.categoryService.getInnerCategoriesBySubId(catID, subCatID);
        }
        this.subs = this.categoryService.selectedInnerCategories
          .asObservable()
          .subscribe((data) => {
            if (data) {
              this.selectedInnerCategories = data;
            }
          });
        this.isInnerMenu = true;
        this.innerClickSubs =
          this.filterService.onInnerCategoryClicked.subscribe((value) => {
            if (value) {
              this.onSearch(value.event);
            }
          });
      } else {
        this.productFilterService.searching = true;
        this.productFilterService.initQuery("");
        this.productFilterService.onFilter();
        this.isInnerMenu = false;
      }
    });
  }

  async toggleMenu() {
    if (this.isInnerMenu) {
      this.menuCtrl.toggle();
    } else {
      this.nav.navigateForward("/filter/mobile-category", {
        animated: true,
        animationDirection: "forward",
      });
    }
  }

  ionViewWillEnter = async () => {
    this.screen.headerHide.next(true);
    this.navService.setIconsForCatalog();
    await this.menuCtrl.enable(true, "inner-category");
  };
  ionViewWillLeave = async () => {
    this.screen.headerHide.next(false);
    this.navService.setIconsForHome();
    this.screen.onCloseQuickView.next(true);
    this.innerClickSubs?.unsubscribe();
    this.filterService.onInnerCategoryClicked.next(null);
  };

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: SubCategoryFilterPopupPage,
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      mode: "ios",
      swipeToClose: true,
    });

    await modal.present();
  }

  openProductReview() {
    this.nav.navigateForward("/product-review");
  }

  onInput(event) {
    if (event?.target?.value?.length > 0) {
      this.suggestions = true;
      this.searchText = event.target.value;
    } else {
      this.suggestions = false;
    }
  }
  onSearch(event: any, index = "products") {
    this.productFilterService.searching = true;
    this.productFilterService.initSearch(index, 20, "", false);
    this.productFilterService.initQuery(event);
    this.productFilterService.onFilter();
    this.menuCtrl.close();
  }
  onCancel() {
    this.productFilterService.searching = false;
  }

  findNextPage(event: any) {
    if (!this.productFilterService.searchEnded) {
      this.productFilterService.page++;
      this.productFilterService.onFilter(this.productFilterService.page);
    }
    setTimeout(async () => {
      event.target.complete();
    }, 500);
  }
}
