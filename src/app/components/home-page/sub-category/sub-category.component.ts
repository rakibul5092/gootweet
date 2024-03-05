import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, filter, first, take } from "rxjs";
import {
  SUB_CATEGORY_IMAGE_BASE,
  lazyImage,
  product_video_base,
} from "src/app/constants";
import {
  CategoryForShow,
  InnerCategory,
  SubCategoryForShow,
} from "src/app/models/category";
import { Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { ProductFilterService } from "./product-filter.service";
import { SearchPopupService } from "src/app/services/search-popup.service";
@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
})
export class SubCategoryComponent implements OnInit {
  @Input() categorySubject: BehaviorSubject<CategoryForShow>;
  @Input() me: User;
  subCats: SubCategoryForShow[];
  height: number;
  subBaseUrl = SUB_CATEGORY_IMAGE_BASE;
  results: Observable<any>;
  searchInfo: { from: number; to: number } = { from: 0, to: 0 };
  selectedInners: InnerCategory[] = [];
  selectedInner: InnerCategory;
  subcatImageBase = SUB_CATEGORY_IMAGE_BASE;
  productVideoBase = product_video_base;
  quickViewProduct: Product;
  default = lazyImage;
  constructor(
    public searchPopupService: SearchPopupService,
    private productFilterService: ProductFilterService
  ) {}

  ngOnInit() {
    this.productFilterService.initSearch();
    this.results = this.productFilterService.searchResult;
    this.productFilterService.searchInfo.subscribe((res) => {
      this.searchInfo = res;
    });

    this.categorySubject.subscribe((res: any) => {
      if (res && res.clicked) {
        this.selectedInners = [];
        this.productFilterService.searchResult.next([]);
        this.searchPopupService.getSubCategoryWithInnerCategory(res);
        this.quickViewProduct = null;
        this.onCategoryClick(res.id);
      }
    });
  }

  onCategoryClick(catId: string) {
    this.productFilterService.page = 0;
    this.productFilterService.initQuery(catId);
    this.productFilterService.onFilter();
  }
  onSubClick(sub) {
    this.productFilterService.page = 0;
    this.selectedInners = sub?.innerCategories || [];
    this.productFilterService.initQuery(sub.id);
    this.productFilterService.onFilter();
  }

  onInnerClick(inner: InnerCategory) {
    if (this.selectedInner) {
      this.selectedInner.selected = false;
    }
    this.selectedInner = inner;
    this.selectedInner.selected = true;
    this.productFilterService.page = 0;
    this.productFilterService.initQuery(inner.id);
    this.productFilterService.onFilter();
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

  async quickView(event: any, ownerUid: string) {
    this.quickViewProduct = event;
  }
}
