import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  AlertController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { ItemReorderEventDetail } from "@ionic/core";
import { first } from "rxjs/operators";
import { ProductsSixPopupPage } from "src/app/components/popovers/products-six-popup/products-six-popup.page";
import { getTimestamp, getUser } from "src/app/services/functions/functions";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { manufacturer_normal_post } from "../../constants";
import { Product } from "../../models/product";
import { User } from "../../models/user";
import { Country } from "../../models/wall-post";
import { WallPostData, wallpostFile } from "../../models/wall-test";
import { AwsUploadService } from "../../services/aws-upload.service";
import { UtilityService } from "../../services/utility.service";
import { WalletService } from "../../services/wallet.service";
import { AddWallPostService } from "./add-wall-post.service";
import { LoginService } from "src/app/services/login.service";

// import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
  selector: "app-advertisement-two",
  templateUrl: "./advertisement-two.page.html",
  styleUrls: ["./advertisement-two.page.scss"],
})
export class AdvertisementTwoPage implements OnInit {
  wallPost: WallPostData = {
    countries: [],
    description: "",
    products: [],
    productsIds: [],
    metaData: null,
    files: [],
    title: "",
    timestamp: "",
    owner: null,
    isWorkerNeeded: false,
    isDesignerNeeded: false,
    type: manufacturer_normal_post,
    isPaid: false,
    convertedTime: "",
    button1Text: "",
    button2Text: "",
    layout: 1,
  };

  relatedProducts: Product[] = [];
  tempProducts: Product[] = [];
  country: Country = {
    name: "",
    flag: "",
  };
  allCountries: any[] = [];

  me: User;

  checked = false;

  postId: string;
  isEditing = false;
  apiCalled = false;
  constructor(
    private modalController: ModalController,
    private service: AddWallPostService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    public util: UtilityService,
    private walletService: WalletService,
    private awsUpload: AwsUploadService,
    private gotoProfileService: GotoProfileService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      console.log(user);

      if (user) {
        this.me = user;
        this.postId = this.service.generateWallId();
        this.activatedRoute.queryParams
          .pipe(first())
          .subscribe(async (queryParams) => {
            if (queryParams && queryParams.postId) {
              await this.util.present("Kraunami postai...");
              this.postId = queryParams.postId;
              this.isEditing = true;
              if (this.me.uid) {
                this.service
                  .getWallPostById(this.postId)
                  .pipe(first())
                  .subscribe(
                    async (query) => {
                      this.wallPost = query.data() as WallPostData;
                      await this.util.dismiss();
                    },
                    async () => {
                      await this.util.dismiss();
                    }
                  );
              }
            }
          });
        if (this.me.rule === "manufacturer") {
          this.service
            .getRelatedProducts(user.uid)
            .pipe(first())
            .subscribe((query) => {
              this.relatedProducts = [];
              query.forEach((item) => {
                let id = item.payload.doc.id;
                let data = item.payload.doc.data();
                let product: Product = { id: id, ...data } as Product;
                this.relatedProducts.push(product);
              });
            });
        }
      }
    });
    // this.getAllCountries(true);
  }
  lastCalledUrl = "";
  onDescriptionChange(event) {
    const text: string = event.target.value;
    if (text || text !== "") {
      var matches = text.match(/\bhttps?:\/\/\S+/gi);
      if (matches && matches.length > 0 && this.lastCalledUrl !== matches[0]) {
        this.lastCalledUrl = matches[0];
        this.apiCalled = true;
        this.awsUpload.getMetaTags(matches[0]).subscribe(
          (res: any) => {
            if (res && res.title) {
              this.wallPost.metaData = {
                siteName: res.site_name || "",
                title: res.title,
                img: res.image,
                description: res.description || "",
                url: matches[0],
              };
            }
            this.apiCalled = false;
          },
          (err) => {
            this.apiCalled = false;
          }
        );
      } else {
        this.apiCalled = false;
      }
    }
  }

  //Final save operation here
  length = 0;
  async saveWallPost() {
    this.wallPost.owner = this.me;
    this.wallPost.timestamp = getTimestamp();
    await this.util.presentWithoutTimeout("Saugoma...");
    this.awsUpload
      .uploadMultipleFiles(
        this.filesData,
        "wall_post_files/" + this.postId + "/"
      )
      .then(async (res) => {
        console.log("finished....", res);
        if (this.isEditing) {
          this.service
            .updateWallPost(this.wallPost, this.postId)
            .then(async () => {
              this.util.setLoadingText("Tikrinama piniginė...");
              await this.walletService
                .checkWallet(this.me.uid)
                .then(async (flag) => {
                  await this.util.dismiss().then(() => {
                    this.gotoProfileService.gotoProfile(this.me);
                  });
                });
            });
        } else {
          await this.service
            .saveWallPost(this.wallPost, this.postId)
            .then(async (docRef) => {
              this.util.setLoadingText("Tikrinama piniginė...");
              await this.walletService
                .checkWallet(this.me.uid)
                .then(async (flag) => {
                  await this.util.dismiss();
                  this.gotoProfileService.gotoProfile(this.me);
                  if (this.wallPost.isDesignerNeeded) {
                    const navExtra: NavigationExtras = {
                      queryParams: {
                        my_uid: this.me.uid,
                        wall_id: this.postId,
                      },
                    };
                    if (flag && this.wallPost.isDesignerNeeded) {
                      this.navController.navigateForward(
                        "advertisement-four",
                        navExtra
                      );
                    } else {
                      this.navController.navigateForward(
                        "advertisement-three",
                        navExtra
                      );
                    }
                  } else {
                  }
                });
            })
            .catch(async () => {
              await this.util.dismiss();
            });
        }
      });
  }

  // product add modal
  async openProductAddModal() {
    const data = {
      uid: this.me.uid,
    };
    const modal = await this.modalController.create({
      component: ProductsSixPopupPage,
      backdropDismiss: true,
      componentProps: data,
      keyboardClose: true,
      swipeToClose: true,
      cssClass: "product-add-modal",
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        res.data.forEach((item: any) => {
          if (
            !this.wallPost.products.find((pItem) => {
              return pItem.id == item.id;
            })
          ) {
            item.delivery_time = "";
            this.wallPost.products.push(item);
            this.wallPost.productsIds.push(item.id);
            this.length = this.wallPost.products.length;
          }
        });
      }
    });
    return await modal.present();
  }
  getMaterial(good: any) {
    let g;
    if (Array.isArray(good)) {
      g = [good[0]];
    } else {
      g = good;
    }
    return g;
  }

  filesData: wallpostFile[] = [];
  async onFileSelection(event: any) {
    this.filesData = this.filesData.concat(event.filesData);
    this.wallPost.files = this.wallPost.files.concat(event.files);
  }

  addRelatedToSelectedProduct(product: Product, i: number) {
    if (
      !this.wallPost.products.find((pItem) => {
        return pItem.id == product.id;
      })
    ) {
      product.delivery_time = "";
      this.relatedProducts.splice(i, 1);
      this.wallPost.products.push(product);
      this.wallPost.productsIds.push(product.id);
      this.length = this.wallPost.products.length;
    }
  }

  onCountrySelect(country: any) {
    this.country = {
      flag: country?.flag,
      name: country?.name,
    };
    this.wallPost.countries.push(country);
  }
  removeCountry(index: number) {
    this.wallPost.countries.splice(index, 1);
  }

  removeProduct(i: number) {
    this.wallPost.productsIds.splice(i, 1);
    // let id = this.tempProducts[i].id;
    this.wallPost.products.splice(i, 1);
    this.length = this.wallPost.products.length;
    // this.wallPost.products.splice(this.wallPost.products.indexOf(id), 1);
  }

  async doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    let from = event?.detail.from;
    let to = event?.detail.to;
    let temp = this.wallPost.productsIds[from];
    this.wallPost.productsIds[from] = this.wallPost.productsIds[to];
    this.wallPost.productsIds[to] = temp;
    this.tempProducts = event.detail.complete(this.wallPost.products);
  }

  async changeWorkerNeeded(isNeeded: boolean) {
    this.wallPost.isWorkerNeeded = !isNeeded;
  }
  async changeDesignerNeeded(isNeeded: boolean) {
    this.wallPost.isDesignerNeeded = !isNeeded;
  }

  async showWarning() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Iveskite reikiamus duomenis!!!",
      message: "Patikrinke ivedimo laukelius...",
      mode: "ios",
      buttons: [
        {
          text: "Gerai",
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });
    alert.present();
  }

  back() {
    this.navController.back();
  }
}
