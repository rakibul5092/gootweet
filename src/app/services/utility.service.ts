import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  AlertController,
  LoadingController,
  PopoverController,
} from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { AppComponent } from "../app.component";
import { SharePostPopupPage } from "../components/popovers/share-post-popup/share-post-popup.page";
import {
  cloud_function_base_url,
  followed,
  products,
  users,
  wallpost,
} from "../constants";
import { ConnectedDesigner, UnverifiedUser } from "../models/user";
import { WallPostData, WallPostForChat } from "../models/wall-test";
import { getTimestamp } from "./functions/functions";
import { ModalService } from "./modal.service";
import { lastValueFrom } from "rxjs";

const UNVERIFIED = "unverified-user";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  isBack: boolean = false;
  constructor(
    private alertController: AlertController,
    private popoverController: PopoverController,
    private modalService: ModalService,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private toasterService: ToastrService,
    private http: HttpClient
  ) {}

  async openSharePopup(data: any) {
    let popover = await this.popoverController.create({
      component: SharePostPopupPage,
      componentProps: data,
      animated: true,
      mode: "ios",
      keyboardClose: true,

      backdropDismiss: true,
      cssClass: "share-popover",
    });

    popover.onDidDismiss().then((value: any) => {
      if (value && value.data) {
      }
    });
    return await popover.present();
  }

  async openContactsModal(component, isCart: boolean) {
    let data = {
      isCart: isCart,
    };
    this.modalService.presentModal(component, data, "send-to-messenger", "ios");
  }

  isLoading = false;
  async present(message: any) {
    this.isLoading = true;
    let loading = await this.loadingController.create({
      animated: true,
      message: message,
      mode: "ios",
    });
    await loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 25000);
  }
  async presentWithoutTimeout(message: any) {
    this.isLoading = true;
    let loading = await this.loadingController.create({
      animated: true,
      message: message,
      mode: "ios",
    });
    await loading.present();
  }

  setLoadingText(text: string) {
    const elem = document.querySelector(
      "div.loading-wrapper div.loading-content"
    );
    if (elem) elem.innerHTML = text;
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      await this.loadingController.dismiss().then(() => {});
    }
  }

  async showToast(msg: string, color: string, title: string = "") {
    if (color == "success") {
      this.toasterService.success(msg, title, {
        positionClass: "toast-bottom-left",
      });
    } else {
      this.toasterService.error(msg, title, {
        positionClass: "toast-bottom-left",
      });
    }
  }

  async showAlert(header: string, message: string) {
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
            this.alertController.dismiss({ confirm: false });
          },
        },
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss({ confirm: true });
          },
        },
      ],
    });
    await alert.present();
    return alert;
  }

  async askDeletePermission() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Warning",
      message: "Are you sure want to delete?",
      mode: "ios",
      buttons: [
        {
          text: "Atšaukti",
          handler: () => {
            this.alertController.dismiss({ confirm: false });
          },
        },
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss({ confirm: true });
          },
        },
      ],
    });
    await alert.present();
    return alert;
  }

  getProduct(myUid: string, pid: string) {
    return this.firestore
      .collection(products)
      .doc(myUid)
      .collection(products)
      .doc(pid)
      .get();
  }
  async getWallPost(postId: string): Promise<WallPostForChat> {
    return await lastValueFrom(
      this.firestore.collection(wallpost).doc(postId).get()
    ).then(async (query) => {
      let data: WallPostData = query.data() as WallPostData;
      let id = query.id;

      return await lastValueFrom(
        this.firestore.collection(users).doc(data.owner.uid).get()
      ).then((uQuery) => {
        let wallPost: WallPostForChat = {
          data: data,
          id: id,
        };
        return wallPost;
      });
    });
  }

  async removeUnverifiedUser() {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.removeItem(UNVERIFIED);
  }

  async saveUnverifiedUser(user: UnverifiedUser) {
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(UNVERIFIED, JSON.stringify(user));
  }

  addToFollow(meUid: string, ownerUid: string) {
    let timestamp = getTimestamp();
    this.firestore
      .collection(followed)
      .doc(meUid)
      .collection(followed)
      .doc(ownerUid)
      .set({ uid: ownerUid, timestamp: timestamp })
      .then(() => {
        this.checkIsFollowed(meUid, ownerUid);
      });
  }

  isFollowed = false;
  checkIsFollowed(myUid, userUid) {
    if (myUid) {
      this.firestore
        .collection(followed)
        .doc(myUid)
        .collection(followed, (ref) => ref.where("uid", "==", userUid))
        .get()
        .pipe(first())
        .subscribe((values) => {
          if (values.docs.length > 0) {
            this.isFollowed = true;
          } else {
            this.isFollowed = false;
          }
        });
    }
  }

  getAllConnectedDesigners(myUid: string) {
    return this.http.get<{ status: boolean; data: ConnectedDesigner[] }>(
      cloud_function_base_url +
        "/get_manufacturer_designers?manufacturer_uid=" +
        myUid
    );
  }
}
