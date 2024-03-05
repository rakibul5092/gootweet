import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  AlertController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { HttpRequestsService } from "src/app/services/http-requests.service";
import { users } from "../../../constants";
import { ConnectedDesigner, User } from "../../../models/user";
import { UtilityService } from "../../../services/utility.service";
import { getUser } from "../../../services/functions/functions";
import { OptionPage } from "src/app/components/designer-vip-option/option/option.page";
import { first } from "rxjs/operators";

@Component({
  selector: "app-connected-designer",
  templateUrl: "./connected-designer.page.html",
  styleUrls: ["./connected-designer.page.scss"],
})
export class ConnectedDesignerPage implements OnInit {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  userType: any;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  userTypeInNumber = new BehaviorSubject<number>(0);
  me: User;
  isLoading = true;

  connectedDesigners: ConnectedDesigner[] = [];

  constructor(
    private nav: NavController,
    private firestore: AngularFirestore,
    private util: UtilityService,
    private gotoProfileService: GotoProfileService,
    private popoverController: PopoverController,
    private httpService: HttpRequestsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        if (user.rule === "user") {
          this.nav.navigateRoot("/");
        }
        this.me = user;
        this.profileCheckEvent.emit(true);
        this.util
          .getAllConnectedDesigners(this.me.uid)
          .pipe(first())
          .subscribe(
            (res) => {
              if (res.status) {
                this.connectedDesigners = res.data;
              }
              this.isLoading = false;
            },
            (err) => {
              this.isLoading = false;
              console.log(err);
            }
          );

        this.userType = user.rule;
        this.userTypeInNumber.next(
          this.userType === "manufacturer" ||
            this.userType === "retailchaincenter"
            ? 1
            : 2
        );
        this.isLoggedIn.next(true);

        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            if (query) {
              let data: any = query.data();
              this.me.address = data?.details?.address;
              this.me.profile_photo = data?.profile_photo;
              this.me.cover_photo = data?.cover_photo;
              this.me.full_name.first_name = data?.details?.brand_name;
            }
          });
      } else {
        this.nav.back();
        this.isLoggedIn.next(false);
      }
    });
  }
  async openOption(
    event: any,
    designerUid: string,
    vip: boolean,
    index: number
  ) {
    let data = {
      myUid: this.me.uid,
      designerUid: designerUid,
      vip: vip,
      vipOption: true,
    };
    let menu = await this.popoverController.create({
      component: OptionPage,
      event: event,
      componentProps: data,
      translucent: true,
      mode: "ios",
    });
    menu.onDidDismiss().then((response: any) => {
      const data = response?.data;
      if (response && data) {
        if (!data.remove && data?.m_uid && data?.d_uid) {
          this.httpService
            .changeVip(data?.m_uid, data?.d_uid, data?.vip)
            .pipe(first())
            .subscribe((res: any) => {
              if (res.status) {
                this.util
                  .showToast(
                    res.data ? "VIP added." : "VIP removed",
                    res.data ? "success" : "danger"
                  )
                  .then(() => {
                    this.connectedDesigners[index].vip = res.data;
                  });
              }
            });
        } else if (data.remove && data?.m_uid && data?.d_uid) {
          this.showAlert(
            "Confirmation",
            "Want to disconnect?",
            data?.m_uid,
            data?.d_uid,
            index
          );
        }
      }
    });
    return menu.present();
  }
  async showAlert(
    header: string,
    message: string,
    m_uid: string,
    d_uid: string,
    index: number
  ) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: header,
      message: message,
      mode: "ios",
      buttons: [
        {
          text: "Atšaukti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss();
            this.httpService
              .removeDesigner(m_uid, d_uid)
              .pipe(first())
              .subscribe((res: any) => {
                if (res.status) {
                  this.util.showToast("Removed", "danger");
                  this.connectedDesigners.splice(index, 1);
                }
              });
          },
        },
      ],
    });
    alert.present();
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
