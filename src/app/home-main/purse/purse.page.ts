import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { User } from "../../models/user";
import { Transaction, WalletData } from "../../models/wallet";
import { LoginService } from "../../services/login.service";
import { UtilityService } from "../../services/utility.service";
import { WalletService } from "../../services/wallet.service";
import { INVOICE_BASE } from "src/app/constants";

@Component({
  selector: "app-purse",
  templateUrl: "./purse.page.html",
  styleUrls: ["./purse.page.scss"],
})
export class PursePage implements OnInit {
  wallet: WalletData;
  me: User;
  transactions: Transaction[];

  constructor(
    public nav: NavController,
    private walletService: WalletService,
    private storage: LoginService,
    private util: UtilityService
  ) {}

  async ngOnInit() {
    await this.util.present("Checking wallet...");
    const user = await this.storage.getUser();
    if (user) {
      this.me = user as User;
      const flag = await this.walletService.checkWallet(this.me.uid);
      if (!flag) {
        let wallet: WalletData = {
          balance: 0,
          currency: "€",
        };
        await this.walletService.generateWallet(this.me.uid, wallet);
        this.walletService
          .getWalletData(this.me.uid)
          .pipe(first())
          .subscribe(async (query) => {
            this.wallet = query.data() as WalletData;
            await this.util.dismiss();
          });
      } else {
        this.util.setLoadingText("Loading wallet data...");
        this.walletService
          .getWalletData(this.me.uid)
          .pipe(first())
          .subscribe(
            (query) => {
              this.wallet = query.data() as WalletData;
              this.walletService
                .getWalletTransactions(this.me.uid)
                .pipe(first())
                .subscribe(
                  async (trans) => {
                    this.transactions = trans;

                    await this.util.dismiss();
                  },
                  async (err) => {
                    await this.util.dismiss();
                  }
                );
            },
            async (err) => {
              await this.util.dismiss();
            }
          );
      }
    } else {
      // this.nav.navigateRoot("home");
    }
  }

  back() {
    this.nav.back();
  }
  openInvoice(tran: Transaction) {
    window.open(INVOICE_BASE + tran.id + ".pdf", "_blank");
  }

  topUp() {
    this.nav.navigateForward("purse-replenishment");
  }
}
