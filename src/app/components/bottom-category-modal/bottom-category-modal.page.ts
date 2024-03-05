import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import {
  AnimationController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-bottom-category-modal",
  templateUrl: "./bottom-category-modal.page.html",
  styleUrls: ["./bottom-category-modal.page.scss"],
})
export class BottomCategoryModalPage implements OnInit {
  animation: any;
  constructor(
    private modalController: ModalController,
    public searchPopupService: SearchPopupService,
    private nav: NavController,
    private animations: AnimationController
  ) {}

  ngOnInit() {
    if (this.searchPopupService.categoriesForShow.length == 0) {
      this.searchPopupService.getCategories();
    }
    this.animation = this.animations
      .create()
      .addElement(document.getElementById("sub-items"))
      .duration(2000)
      .fromTo("height", "100%", "100%");
  }
  openSub() {}
  close() {
    this.modalController.dismiss();
  }

  filterWithCategory(c: any, isCat: boolean) {
    let cat = { ...c };
    let navExtra: NavigationExtras = {
      queryParams: {
        search_query: isCat ? cat.data.category : c.data.sub_category,
        isProduct: false,
        category: isCat ? cat.data.category : c.data.sub_category,
      },
    };
    this.modalController.dismiss().then(() => {
      this.nav.navigateForward("search-result", navExtra);
    });
  }
}
