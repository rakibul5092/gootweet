import { Component, Input, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { AlertController, NavController } from "@ionic/angular";
import { AwsUploadService } from "../../../../services/aws-upload.service";
import { UtilityService } from "../../../../services/utility.service";
import { Designer } from "../../../../models/user";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { portfolio } from "../../../../constants";

@Component({
  selector: "app-designer-portfolio",
  templateUrl: "./designer-portfolio.component.html",
  styleUrls: ["./designer-portfolio.component.scss"],
})
export class DesignerPortfolioComponent implements OnInit {
  // @Input() isDesignerLoggedIn: boolean;
  @Input() isMyProfile: boolean;
  @Input() productOwner: Designer;

  constructor(
    public profileService: ProfileService,
    private navController: NavController,
    private alertController: AlertController,
    private awsUpload: AwsUploadService,
    private util: UtilityService,
    private angularFirestore: AngularFirestore
  ) {}

  ngOnInit() {}

  gotoAddPortfolio() {
    this.navController.navigateForward("designer/designer-profile-new-project");
  }

  async onDeletePortfolio(portfolio, i) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Patvirtinimas!",
      message: "Ar tikrai norite ištrinti?",
      mode: "ios",
      buttons: [
        {
          text: "Nutarukti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Istrinti",
          cssClass: "delete",
          handler: () => {
            this.deletePortfolio(portfolio, i);
          },
        },
      ],
    });
    alert.present();
  }

  async deletePortfolio(port, i) {
    this.awsUpload.removeImages("portfolio_photos", port.data.images);
    await this.angularFirestore
      .collection(portfolio)
      .doc(this.productOwner.uid)
      .collection(portfolio)
      .doc(port.id)
      .delete()
      .then(async () => {
        this.profileService.portfolios.splice(i, 1);
        await this.util.showToast("Sėkmingai pašalintas", "success");
      })
      .catch(async () => {
        await this.util.showToast("Ivyko klaida", "danger");
      });
  }

  findNextPortfolio(event) {
    if (this.productOwner) {
      this.profileService.findPortfolio(this.productOwner.uid);
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }
}
