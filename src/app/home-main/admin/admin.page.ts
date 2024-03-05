import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { LoginService } from "src/app/services/login.service";
import { UtilityService } from "src/app/services/utility.service";
import { ScreenService } from "../../services/screen.service";
import { VisibleService } from "../../chat/chat-designer/visible.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  active = 1
  ngOnInit() {
    let routerOutlet = document.getElementById("main");
    routerOutlet.style.marginTop = "0";
  }


  public appPages = [
    { title: "Home", url: "admin/dashboard", icon: "home" },
    { title: "Category", url: "admin/categoy", icon: "mail" },
    { title: "Users", url: "status-list", icon: "location" },
  ];
  constructor(
    private login: LoginService,
    public nav: NavController,
    public router: Router,
    private util: UtilityService,
    private screen: ScreenService,
    private visibleService: VisibleService
  ) { }

  onMenuClick(cliked: number) {
    this.active = cliked;

  }

  ionViewWillEnter() {
    this.screen.headerHide.next(true);
    this.visibleService.isVisible.next(false);
  }
  ionViewDidLeave() {
    this.screen.headerHide.next(false);
  }

  logout() {
    this.util.present("Atsijungti...").then(() => {
      setTimeout(() => {
        this.util.dismiss().then(() => {
          this.login.signOut().then(() => {
            this.login.isUserLoggedIn.next(false);
            let routerOutlet = document.getElementById("main");
            routerOutlet.style.marginTop = "70px";
            this.nav.navigateRoot("login");
          });
        });
      }, 1500);
    });
  }
}
