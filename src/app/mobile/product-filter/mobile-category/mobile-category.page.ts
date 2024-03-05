import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import {
  CATEGORY_IMAGE_BASE,
  SUB_CATEGORY_IMAGE_BASE,
  selectedCategoryID,
  selectedSubcategoryID,
} from "src/app/constants";
import { ScreenService } from "src/app/services/screen.service";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-mobile-category",
  templateUrl: "./mobile-category.page.html",
  styleUrls: ["./mobile-category.page.scss"],
})
export class MobileCategoryPage implements OnInit {
  baseUrl = CATEGORY_IMAGE_BASE;
  subcatImageBase = SUB_CATEGORY_IMAGE_BASE;
  isLoaded = new BehaviorSubject<boolean>(false);
  selectedCategory = new BehaviorSubject<any>(null);
  prevCat: any;
  constructor(
    private screen: ScreenService,
    public searchPopupService: SearchPopupService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.searchPopupService.categoriesForShow.map((item) => {
      item.isSelected = false;
    });
    this.searchPopupService.categoriesLoaded.subscribe((res) => {
      if (res) {
        if (this.prevCat) {
          this.prevCat.isSelected = false;
        }
        const selectedCategory = this.searchPopupService.categoriesForShow[0];
        this.searchPopupService.getSubCategoryWithInnerCategory(
          selectedCategory
        );
        selectedCategory.isSelected = true;
        this.selectedCategory.next(selectedCategory);
        this.prevCat = selectedCategory;
      }
    });
  }

  onCatClick(category: any) {
    this.searchPopupService.getSubCategoryWithInnerCategory(category);
    if (this.selectedCategory) {
      this.selectedCategory.value.isSelected = false;
    }
    category.isSelected = true;
    this.selectedCategory.next(category);
  }

  onSubClick(subCat: any) {
    localStorage.setItem(selectedCategoryID, this.selectedCategory.value.id);
    localStorage.setItem(selectedSubcategoryID, subCat.id);
    this.nav.navigateForward(
      "/filter/search/" + subCat.id + "/" + subCat.data.sub_category,
      { animated: true, animationDirection: "forward" }
    );
  }

  ionViewWillEnter = () => this.screen.fullScreen.next(true);
  ionViewWillLeave = () => this.screen.fullScreen.next(false);
}
