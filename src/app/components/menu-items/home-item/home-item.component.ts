import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { NewPostService } from "./new-post.service";

@Component({
  selector: "app-home-item",
  templateUrl: "./home-item.component.html",
  styleUrls: ["./home-item.component.scss"],
})
export class HomeItemComponent implements OnInit, OnDestroy {
  newWallsubs: any;
  constructor(
    public newPostService: NewPostService,
    private nav: NavController,
    private router: Router
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {}
  navigateRoot() {
    let currentRoute = this.router.url;

    if (currentRoute == "/") {
      window.location.reload();
      return;
    }
    this.nav.navigateRoot("/", {
      animated: true,
      animationDirection: "back",
    });
  }
}
