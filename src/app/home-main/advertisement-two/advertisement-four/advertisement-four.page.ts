import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AddWallPostService } from "../../advertisement-two/add-wall-post.service";
import { User } from "../../../models/user";
import { WalletData } from "../../../models/wallet";
import { LoginService } from "../../../services/login.service";
import { UtilityService } from "../../../services/utility.service";
import { WalletService } from "../../../services/wallet.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-advertisement-four",
  templateUrl: "./advertisement-four.page.html",
  styleUrls: ["./advertisement-four.page.scss"],
})
export class AdvertisementFourPage implements OnInit {
  wallId: string;
  myUid: string;
  me: User;
  wallet: WalletData;

  constructor(
    private wallAddService: AddWallPostService,
    private nav: NavController,
    private activatedRoute: ActivatedRoute,
    private storage: LoginService,
    private walletService: WalletService,
    private util: UtilityService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(first())
      .subscribe(async (queryParam) => {
        if (queryParam && queryParam.wall_id && queryParam.my_uid) {
          this.wallId = queryParam.wall_id;
          this.myUid = queryParam.my_uid;
          await this.storage.getUser().then((user: any) => {
            this.me = user as User;
          });
          this.walletService
            .getWalletData(this.myUid)
            .pipe(first())
            .subscribe((query) => {
              this.wallet = query.data() as WalletData;
            });
        }
      });
  }

  updateWallPostPaid() {
    if (this.wallet.balance >= 100) {
      this.util.present("Atnaujinti posta apmokant už jį...");
      this.wallAddService
        .updateWallPostIsPaid(this.wallId, true)
        .then(() => {
          this.util.dismiss();
          this.nav.navigateRoot("profile");
        })
        .catch(() => {
          this.util.dismiss();
          this.util.showAlert("Klaida", "Patikrinkite savo interneto jungtį");
        });
    } else {
      this.util.showAlert(
        "Trūksta lėsų piniginėje.",
        "Papildykite savo piniginę."
      );
    }
  }
  skipToProfile() {
    this.util.present("Praleisti...");
    this.wallAddService
      .updateWallPostNotPaid(this.wallId, false)
      .then(() => {
        this.util.dismiss();
        this.nav.navigateRoot("profile");
      })
      .catch(() => {
        this.util.dismiss();
      });
  }

  async topUpMoney() {
    this.nav.navigateForward("purse-replenishment");
  }
}
