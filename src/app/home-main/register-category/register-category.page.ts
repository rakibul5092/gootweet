import {Component, OnInit} from "@angular/core";
import {NavController} from "@ionic/angular";
import {NavigationExtras} from "@angular/router";

@Component({
  selector: "app-register-category",
  templateUrl: "./register-category.page.html",
  styleUrls: ["./register-category.page.scss"],
})
export class RegisterCategoryPage implements OnInit {
  constructor(private navController: NavController) { }

  ngOnInit() {}

  gotoInformation(type: string, cat: string) {
    let navExtra: NavigationExtras = {
      queryParams: {
        type: type,
        cat: cat,
      },
    };
    if (type === "designer") {
      this.navController.navigateForward("designer/designer-register-details", navExtra);
    } else {
      this.navController.navigateForward("register-details", navExtra);
    }
  }

  back() {
    this.navController.back();
  }
}
