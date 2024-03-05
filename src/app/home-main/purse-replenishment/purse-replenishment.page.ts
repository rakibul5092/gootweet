import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { User } from "../../models/user";
import { Transaction, WalletData } from "../../models/wallet";
import { getTimestamp } from "../../services/functions/functions";
import { LoginService } from "../../services/login.service";
import { UtilityService } from "../../services/utility.service";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: "app-purse-replenishment",
  templateUrl: "./purse-replenishment.page.html",
  styleUrls: ["./purse-replenishment.page.scss"],
})
export class PurseReplenishmentPage implements OnInit {
  wallet: WalletData;
  amount: number;
  me: User;
  disabled = true;

  constructor(
    private util: UtilityService,
    private walletService: WalletService,
    private storage: LoginService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    const user = await this.storage.getUser();
    if (user) {
      this.me = user as User;
      this.walletService
        .getWalletData(this.me.uid)
        .pipe(first())
        .subscribe((query) => {
          this.wallet = query.data() as WalletData;
        });
    }
  }

  onAmountChange() {
    if (this.amount) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  async topUp() {
    this.disabled = true;
    await this.util.present("Trancliacija generuojama...");
    if (this.amount) {
      let transObj: Transaction = {
        type: "topup",
        amount: this.amount,
        currency: "€",
        isCredit: true,
        isCompleted: false,
        isPaid: false,
        timestamp: getTimestamp(),
      };
      await this.walletService
        .addTransaction(this.me.uid, transObj)
        .then(async (query) => {
          let id = query.id;
          this.walletService
            .getFurniinAccInfo()
            .subscribe(async (query: any) => {
              let project_id = query.data().project_id;
              let password = query.data().password;
              const test = query.data().test || 0;
              if (project_id && password) {
                this.walletService
                  .requestPaysera(
                    project_id + "",
                    password,
                    id,
                    this.amount * 100 + "",
                    this.me.uid,
                    test
                  )
                  .subscribe(
                    async (res: any) => {
                      await this.util.dismiss();
                      window.open(
                        res.url,
                        "Topup",
                        "menubar=1,resizable=0,width=550,height=700"
                      );
                      // window.open(res.url, "_blank");
                      this.disabled = false;
                    },
                    async (err) => {
                      await this.util.showAlert(
                        "Klaida",
                        "Klaidinka mokėjimo informacija."
                      );
                    }
                  );
              } else {
                await this.util.dismiss();
                await this.util.showAlert(
                  "Klaida",
                  "GOOTWEET mokėjimo duomenys nerasti."
                );
              }
            });

          return;
        });
    }
  }

  back() {
    this.navController.back();
  }
}
