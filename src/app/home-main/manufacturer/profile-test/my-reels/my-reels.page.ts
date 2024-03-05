import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ReelsService } from "src/app/components/home-page/reels/reels.service";
import { User } from "src/app/models/user";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-my-reels",
  templateUrl: "./my-reels.page.html",
  styleUrls: ["./my-reels.page.scss"],
})
export class MyReelsPage implements OnInit {
  public me: User;
  public isWeb = true;
  public ownerUid = "";
  constructor(
    public reelsService: ReelsService,
    private nav: NavController,
    private loginService: LoginService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.ownerUid = this.router.url.split("/")[3];
    this.me = await this.loginService.getUser();
    if (this.ownerUid) {
      this.reelsService.getAllReelsByUid(this.ownerUid);
    }
  }

  onReelCardClick(index: number) {
    this.reelsService.selectedIndex = index;
    this.nav.navigateForward(
      "reel-view?type=user-reels&index=" +
        index +
        "&uid=" +
        this.ownerUid +
        "&id=" +
        this.reelsService.myReels[index].id,
      {
        animated: true,
        animationDirection: "forward",
      }
    );
  }
}
