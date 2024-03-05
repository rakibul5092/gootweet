import { Component, OnInit } from "@angular/core";
import { HomeService } from "../home.service";
import { LoginService } from "src/app/services/login.service";
import { User } from "src/app/models/user";
import { SearchPopupService } from "src/app/services/search-popup.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  public me: User;
  constructor(
    public homeService: HomeService,
    private storage: LoginService,
    public searchPopupService: SearchPopupService
  ) {}

  async ngOnInit() {
    await this.storage.getUser().then(async (user: User) => {
      this.me = user;
    });
    this.searchPopupService.categoriesLoaded.subscribe((res) => {
      if (res) {
        this.homeService.onCategoryClicked(
          this.searchPopupService.categoriesForShow[0]
        );
        (this.searchPopupService.categoriesForShow[0] as any).clicked = true;
      }
    });
  }
}
