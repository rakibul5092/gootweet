import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AddWallPostService } from "../../advertisement-two/add-wall-post.service";
import { WalletData } from "../../../models/wallet";
import { UtilityService } from "../../../services/utility.service";
import { WalletService } from "../../../services/wallet.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-advertisement-three",
  templateUrl: "./advertisement-three.page.html",
  styleUrls: ["./advertisement-three.page.scss"],
})
export class AdvertisementThreePage implements OnInit {
  wallId: string;
  myUid: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    private navController: NavController,
    private util: UtilityService,
    private addPostService: AddWallPostService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(first())
      .subscribe(async (queryParam) => {
        if (queryParam && queryParam.wall_id && queryParam.my_uid) {
          this.wallId = queryParam.wall_id;
          this.myUid = queryParam.my_uid;
          await this.walletService.checkWallet(this.myUid);
        }
      });
  }

  makeWalletAndGoPayment() {
    let wallet: WalletData = {
      balance: 0,
      currency: "€",
    };

    if (this.myUid && this.wallId) {
      this.util.present("Generating wallet...");
      const navExtra: NavigationExtras = {
        queryParams: {
          my_uid: this.myUid,
          wall_id: this.wallId,
        },
      };
      this.walletService.generateWallet(this.myUid, wallet).then(() => {
        this.util.dismiss().then(() => {
          this.navController.navigateForward("advertisement-four", navExtra);
        });
      });
    }
  }

  skipToProfile() {
    this.util.present("Skipping...");
    this.addPostService
      .updateWallPostNotPaid(this.wallId, false)
      .then(() => {
        this.util.dismiss();
        this.navController.navigateRoot("profile");
      })
      .catch(() => {
        this.util.dismiss();
      });
  }
}
