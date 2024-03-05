import { Component, EventEmitter, Output } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { CATEGORY_IMAGE_BASE } from "src/app/constants";
import { SubCategoryForShow } from "src/app/models/category";
import { SearchPopupService } from "src/app/services/search-popup.service";
declare var $: any;

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent {
  @Output() categoryClicked: EventEmitter<SubCategoryForShow[]> =
    new EventEmitter(null);

  baseUrl = CATEGORY_IMAGE_BASE;
  constructor(
    public searchPopupService: SearchPopupService,
    private navController: NavController
  ) {}

  onImgLoad(i) {
    if (i == 10) {
      setTimeout(() => {
        if ($('[data-toggle="tooltip"]'))
          $('[data-toggle="tooltip"]').tooltip();
      }, 5000);
    }
  }

  onCategoryClick(cat) {
    if (cat) {
      (this.searchPopupService.categoriesForShow as any[]).map((item) => {
        if (cat?.id !== item?.id) {
          item.clicked = false;
        }
      });
      cat.clicked = !cat.clicked;
      this.searchPopupService.isAllDismissed = !cat.clicked;
    } else {
      (this.searchPopupService.categoriesForShow as any[]).map((item) => {
        item.clicked = false;
      });
    }
    this.categoryClicked.emit(cat.clicked ? cat : null);
  }
  filterWithCategory(c: any, isCat: boolean) {
    let cat = { ...c };
    let navExtra: NavigationExtras = {
      queryParams: {
        search_query: isCat ? cat.data.category : cat.data.sub_category,
        isProduct: false,
        category: isCat ? cat.data.category : cat.data.sub_category,
      },
    };
    this.navController.navigateForward("search-result", navExtra);
  }
}
