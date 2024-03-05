import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { BottomNavService } from "src/app/components/layouts/bottom-nav/bottom-nav.service";
import { InnerCategory } from "src/app/models/category";
import { ScreenService } from "src/app/services/screen.service";
import { FilterService } from "./filter.service";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-product-filter",
  templateUrl: "./product-filter.page.html",
  styleUrls: ["./product-filter.page.scss"],
})
export class ProductFilterPage implements OnInit, OnDestroy {
  selectedInnerCategories: InnerCategory[];
  subs: Subscription;
  constructor(
    private categoryService: SearchPopupService,
    private screen: ScreenService,
    private navService: BottomNavService,
    private filterService: FilterService
  ) {}
  ngOnDestroy(): void {
    this.screen.headerHide.next(false);
    this.navService.setIconsForHome();
    this.screen.onCloseQuickView.next(true);
  }

  ngOnInit() {
    this.subs = this.categoryService.selectedInnerCategories
      .asObservable()
      .subscribe((data) => {
        if (data) {
          this.selectedInnerCategories = data;
        }
      });
  }

  onSearch(id: string) {
    this.filterService.onInnerCategoryClicked.next({
      event: id,
      searchIndex: "",
    });
  }
}
