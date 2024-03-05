import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { AddProductService } from "./add-product.service";
import { ItemReorderEventDetail } from "@ionic/core";
import { User } from "../../../../models/user";
import {
  AlertController,
  ModalController,
  NavController,
} from "@ionic/angular";
import {
  Category,
  CategoryData,
  InnerCategory,
  InnerCategoryData,
  SubCategory,
  SubCategoryData,
} from "../../../../models/category";
import {
  Color,
  Delivery,
  Image,
  Measure,
  NormalGood,
  ProductForAdd,
  VariationGood,
} from "../../../../models/product";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  material_image_base,
  product_image_base,
  products,
  product_video_base,
} from "../../../../constants";
import { ActivatedRoute } from "@angular/router";
import { UtilityService } from "../../../../services/utility.service";
import { ColorPopoverPage } from "./color-popover/color-popover.page";
import { AwsUploadService } from "../../../../services/aws-upload.service";
import {
  getTimestamp,
  getUser,
} from "../../../../services/functions/functions";
// import { AngularEditorConfig } from "@kolkov/angular-editor";
import { MaterialsPopupPage } from "src/app/components/popovers/materials-popup/materials-popup.page";
import { first, map } from "rxjs/operators";
import { BehaviorSubject, Subscription } from "rxjs";
import { LoginService } from "src/app/services/login.service";

interface InsertedMaterial {
  codes: string[];
}
interface BranchOfMaterials {
  insertedMaterials: InsertedMaterial[];
}

@Component({
  selector: "app-product-information",
  templateUrl: "./product-information.page.html",
  styleUrls: ["./product-information.page.scss"],
})
export class ProductInformationPage implements OnInit, OnDestroy {
  sizes: string[] = [];
  me: User;
  myUid: string;
  isNormal = true;

  product_id: string = "";
  title: string = "";
  code: string = "";
  categories: Category[];
  subCategories: SubCategory[];
  innerCategories: InnerCategory[];

  measures: Measure[];

  category: Category = {
    id: "",
    data: {
      category: "",
      timestamp: "",
      products_count: 0,
    },
  };

  subCategory: SubCategory = {
    id: "",
    data: {
      category_id: "",
      sub_category: "",
      timestamp: "",
    },
  };
  emptysubCategory: SubCategory = {
    id: "",
    data: {
      category_id: "",
      sub_category: "none",
      timestamp: "",
    },
  };
  innerCategory: InnerCategory = {
    id: "",
    data: {
      inner_category: "",
      sub_category_id: "",
      timestamp: "",
    },
  };
  emptyinnerCategory: InnerCategory = {
    id: "",
    data: {
      inner_category: "none",
      sub_category_id: "",
      timestamp: "",
    },
  };
  productDetails = "";

  mainImagesData: Image[] = [];
  mainImages: string[] = [];

  mainVideo: string = null;
  mainVideoData: any = {
    base64: null,
    file: null,
  };

  aditionalImagesData: Image[] = [];
  aditionalImages: string[] = [];

  variationGoods: VariationGood[] = [];
  normalGood: NormalGood = {
    price: "",
    inStock: "",
    unit: "",
    quantity: 0,
    expectedStock: "",
    colors: [],
    sizes: [],
  };
  deliveryTypes: Delivery[];
  delivery: Delivery = {
    destination: "Lietuva",
    delivery_info: {
      option: "",
      price: "",
      delivery_time: "",
    },
  };

  percentage = "";
  checked = false;
  mode = "add";
  defaultMat = 1;

  productId: string;
  catSubs: Subscription;
  subCatSubs: Subscription;
  innerCatSubs: Subscription;
  allColorSubs: Subscription;
  testVideo = new BehaviorSubject<string | ArrayBuffer>(null);

  constructor(
    private service: AddProductService,
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private navController: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private util: UtilityService,
    private awsUpload: AwsUploadService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    if (this.catSubs) this.catSubs.unsubscribe();
    if (this.subCatSubs) this.subCatSubs.unsubscribe();
    if (this.innerCatSubs) this.innerCatSubs.unsubscribe();
    if (this.allColorSubs) this.allColorSubs.unsubscribe();
  }

  ngOnInit() {
    this.deliveryTypes = [];
    this.variationGoods = [];
    this.measures = [
      {
        catId: this.category.id,
        measure: "",
        name: "",
      },
    ];
    this.deliveryTypes.push({
      destination: "Lietuva",
      delivery_info: {
        option: "charge",
        price: "0",
        delivery_time: "",
      },
    });
    this.deliveryTypes.push({
      destination: "Nida",
      delivery_info: {
        option: "charge",
        price: "0",
        delivery_time: "",
      },
    });
    this.deliveryTypes.push({
      destination: "Juotkrante",
      delivery_info: {
        option: "charge",
        price: "0",
        delivery_time: "",
      },
    });
    this.selectedDeliveryType = this.deliveryTypes[0];

    this.route.queryParams.pipe(first()).subscribe(async (params) => {
      if (params && params.pid && params.uid) {
        await this.util.present("Užkraunami produktai...");
        this.productId = params.pid;
        this.myUid = params.uid;
        this.mode = "edit";
        this.getProduct(this.productId, this.myUid);
      }
    });
    this.loginService.getUser().then((user: User) => {
      this.me = user;

      this.service.getDeliveryTypes(user.uid).then((dTypes) => {
        if (dTypes) {
          if (dTypes) {
            if (dTypes.length == 1) {
              this.deliveryTypes[0] = dTypes[0];
            }
            if (dTypes.length == 2) {
              this.deliveryTypes[0] = dTypes[0];
              this.deliveryTypes[1] = dTypes[1];
            }
            if (dTypes.length == 3) {
              this.deliveryTypes[0] = dTypes[0];
              this.deliveryTypes[1] = dTypes[1];
              this.deliveryTypes[2] = dTypes[2];
            }
          }
        }
      });

      this.getCategories();
    });
  }

  //swap main image
  swapMainImage(i: number) {
    [this.mainImages[0], this.mainImages[i]] = [
      this.mainImages[i],
      this.mainImages[0],
    ];
    [this.mainImagesData[0], this.mainImagesData[i]] = [
      this.mainImagesData[i],
      this.mainImagesData[0],
    ];
  }

  getProduct(pid: string, uid: string) {
    this.service
      .getProduct(uid, pid)
      .pipe(first())
      .subscribe(
        (query) => {
          let data: any = query.data();
          this.product_id = data?.product_id;
          this.title = data?.title;
          if (data?.category !== "") {
            this.category = {
              id: data?.category?.id,
              data: {
                category: data?.category?.data?.category,
                timestamp: data?.category?.data?.timestamp,
                products_count: data?.category?.data?.products_count || 0,
              },
            };

            this.getSubCategories(this.category.id);
          }
          if (data?.sub_category !== "") {
            this.subCategory = {
              id: data?.sub_category?.id,
              data: {
                sub_category: data?.sub_category?.data?.sub_category,
                timestamp: data?.sub_category?.data?.timestamp,
                category_id: data?.sub_category?.data?.category_id,
              },
            };

            this.getInnerCategories(this.subCategory.id);
          }
          if (data?.inner_category !== "") {
            this.innerCategory = {
              id: data?.inner_category?.id,
              data: {
                inner_category: data?.inner_category?.data?.inner_category,
                timestamp: data?.inner_category?.data?.timestamp,
                sub_category_id: data?.inner_category?.data?.sub_category_id,
              },
            };
          } else {
          }

          this.mainImages = data?.main_images;
          this.mainVideo = data?.video;
          this.mainVideoData.base64 = product_video_base + data?.video;
          this.mainImages.forEach((img) => {
            this.mainImagesData.push({
              imageForView: img.includes("https://")
                ? img
                : product_image_base + img,
              name: img,
              base64String: "",
              format: "",
            });
          });

          this.aditionalImages = data?.aditional_images;
          this.aditionalImages.forEach((img) => {
            this.aditionalImagesData.push({
              imageForView: img.includes("https://")
                ? img
                : product_image_base + img,
              name: img,
              base64String: "",
              format: "",
            });
          });

          this.productDetails = data?.description;
          this.measures = data?.measures;
          if (Array.isArray(data?.good)) {
            this.isNormal = false;
            let imgData: Image[] = [];
            data?.good?.forEach((good) => {
              imgData = [];

              imgData.push({
                base64String: "",
                format: "",
                imageForView: good.images.includes("https://")
                  ? good.images
                  : material_image_base + good.images,
                name: "",
              });
              good.imagesData = imgData;
              this.variationGoods.push(good);
            });
          } else {
            this.isNormal = true;
            this.normalGood = data?.good as NormalGood;
          }
          this.deliveryTypes = data?.delivery_types;
          if (this.deliveryTypes) {
            this.selectedDeliveryType = this.deliveryTypes[0];
          }

          this.util.dismiss();
        },
        () => {
          this.util.dismiss();
        }
      );
  }

  //Final upload.........................
  async save() {
    if (
      this.title.trim() != "" &&
      this.product_id.trim() != "" &&
      this.productDetails.trim() != "" &&
      this.deliveryTypes.length > 0 &&
      (this.normalGood.price != "" || this.variationGoods.length > 0) &&
      this.mainImages.length > 0 &&
      this.category &&
      this.category.data.category != ""
    ) {
      await this.util.present("Išsaugojama...");
      this.service.saveDeliveryTypes(this.me.uid, this.deliveryTypes);
      let allImages: Image[] = [];
      if (this.productId) {
        this.mainImagesData.forEach((img) => {
          if (img.base64String && img.base64String !== "") {
            allImages.push(img);
          }
        });
        this.aditionalImagesData.forEach((img) => {
          if (img.base64String && img.base64String !== "") {
            allImages.push(img);
          }
        });
        if (!this.isNormal) {
          this.variationGoods.forEach((good) => {
            good.imagesData.forEach((img) => {
              if (img.base64String && img.base64String !== "") {
                allImages.push(img);
              }
            });
          });
        }
      } else {
        allImages = allImages.concat(this.mainImagesData);
        allImages = allImages.concat(this.aditionalImagesData);
        if (!this.isNormal) {
          this.variationGoods.forEach((good) => {
            good.imagesData.forEach((img) => {
              if (img.base64String && img.base64String !== "") {
                allImages.push(img);
              }
            });
          });
        }
      }
      let product: ProductForAdd = {
        product_id: this.product_id,
        title: this.title,
        category:
          this.category && this.category.data.category !== ""
            ? this.category
            : "",
        sub_category:
          this.subCategory && this.subCategory.data.sub_category !== "none"
            ? this.subCategory
            : "",
        inner_category:
          this.innerCategory &&
          this.innerCategory?.data.inner_category !== "none"
            ? this.innerCategory
            : "",
        description: this.productDetails,
        main_images: this.mainImages,
        good: this.isNormal ? this.normalGood : this.variationGoods,
        delivery_types: this.deliveryTypes,
        // delivery_time: this.delivery_time,
        commision: this.percentage,
        measures: this.measures,
        video:
          this.mainVideoData.base64 && this.mainVideoData.file
            ? this.mainVideo
            : "",
        timestamp: getTimestamp(),
        aditional_images: this.aditionalImages,
      };
      let uploaded = 0;

      allImages.forEach(async (img) => {
        await this.awsUpload
          .uploadImage("product_photos", img?.name, img.base64String)
          .then(async (res: any) => {
            uploaded++;
            if (uploaded == allImages.length) {
              this.variationGoods.forEach((good) => {
                good.imagesData = [];
              });
              await this.addOrUpdate(product);
            }
          })
          .catch(async (err) => {
            await this.util.dismiss().then(async () => {
              await this.util.showAlert("Klaida!", "Negalima ivesti.");
            });
          });
      });
      if (allImages.length == 0) {
        await this.addOrUpdate(product);
      }
    } else {
      this.checked = true;
      this.showWarning();
    }
  }
  async addOrUpdate(product: ProductForAdd) {
    if (this.mainVideoData) {
      await this.awsUpload.uploadImage(
        "product_videos",
        this.mainVideo,
        this.mainVideoData.file,
        true
      );
    }
    if (this.productId) {
      this.firestore
        .collection(products)
        .doc(this.me.uid)
        .collection(products)
        .doc(this.productId)
        .update(product)
        .then(() => {
          this.util.dismiss().then(() => {
            this.navController.back();
          });
        })
        .catch((err) => {
          this.util.dismiss();
          this.util.showAlert("Klaida! 3", err);
        });
    } else {
      this.firestore
        .collection(products)
        .doc(this.me.uid)
        .set({ test: "asda" }, { merge: true })
        .then(() => {
          this.firestore
            .collection(products)
            .doc(this.me.uid)
            .collection(products)
            .add(product)
            .then(() => {
              this.util.dismiss().then(() => {
                this.navController.back();
              });
            })
            .catch((err) => {
              this.service.dismiss();
              this.util.showAlert("Klaida! 2", err);
            });
        })
        .catch((err) => {
          this.service.dismiss();
          this.util.showAlert("Klaida! 1", err);
        });
    }
  }

  // change product goods type by default normal good selected............
  changeProductType(flag: boolean) {
    this.isNormal = flag;
    if (flag) {
      this.normalGood = {
        price: "",
        inStock: "",
        unit: "",
        quantity: 0,
        expectedStock: "",
        colors: [],
      };
    } else {
      this.variationGoods = [];
    }
  }

  branchOfMaterials: BranchOfMaterials;
  async addVariationMaterials() {
    const modal = await this.modalController.create({
      component: MaterialsPopupPage,
      animated: true,
      mode: "ios",
      backdropDismiss: true,
      keyboardClose: true,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: "material-add-modal",
    });
    modal.onDidDismiss().then((res) => {
      if (res && res.data) {
        if (!this.branchOfMaterials) {
          this.branchOfMaterials = {
            insertedMaterials: [],
          };
        }
        let insertedMaterials: InsertedMaterial = {
          codes: [],
        };
        res?.data?.forEach((mat) => {
          let imgData: Image[] = [];

          imgData.push({
            base64String: "",
            format: "",
            imageForView: mat?.images.includes("https://")
              ? mat?.images
              : material_image_base + mat?.images,
            name: mat?.images,
          });
          this.variationGoods.push({
            material: mat?.name,
            code: mat?.code,
            description: "",
            images: mat?.images,
            imagesData: imgData,
            inStock: "",
            expectedStock: "",
            price: mat?.price,
            color: "",
            unit: "",
            quantity: 0,
          });
          insertedMaterials.codes.push(mat?.code);
        });
        this.branchOfMaterials.insertedMaterials.push(insertedMaterials);
      }
    });
    return await modal.present();
  }
  onMaterialDesInput(des: any, code: string, index: number) {
    var text = des;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.description = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  onMaterialUnitInput(unit: any, code: string, index: number) {
    var text = unit;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.unit = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  onMaterialQuantityInput(quantity: any, code: string, index: number) {
    var text = quantity;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.quantity = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  onMaterialFutureInput(future: any, code: string, index: number) {
    var text = future;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.expectedStock = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  onMaterialStockInput(stock: any, code: string, index: number) {
    var text = stock;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.inStock = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  onMaterialPriceInput(price: any, code: string, index: number) {
    var text = price;
    if (index > 0) {
      return;
    }
    setTimeout(() => {
      let itemOfBranch: InsertedMaterial;
      this.branchOfMaterials?.insertedMaterials?.forEach((arr) => {
        arr.codes.forEach((tmpCode) => {
          if (tmpCode == code) {
            itemOfBranch = arr;

            if (itemOfBranch) {
              this.variationGoods.forEach((item) => {
                if (itemOfBranch.codes.find((c) => c == item.code)) {
                  if (item.code !== code) {
                    item.price = text;
                  }
                }
              });
            }
          }
        });
      });
    }, 500);
  }
  deleteVariationGood(i: any) {
    this.variationGoods.splice(i, 1);
  }
  addMeasure() {
    this.measures.push({
      catId: this.category.id,
      measure: "",
      name: "",
    });
  }
  removeMeasure(i: number) {
    this.measures.splice(i, 1);
  }

  // get all categories for this user from database..............
  getCategories() {
    this.catSubs = this.service
      .getCategories()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const item: Category = {
              data: a.payload.doc.data() as CategoryData,
              id: a.payload.doc.id,
            };
            return item;
          });
        })
      )
      .subscribe((query) => {
        this.categories = query;
        this.subCategories = [];
        this.innerCategories = [];
      });
  }

  // get all subcategory according seleted category.................
  getSubCategories(cat_id: string) {
    this.subCatSubs = this.service
      .getSubCategories(cat_id)
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const item: SubCategory = {
              data: a.payload.doc.data() as SubCategoryData,
              id: a.payload.doc.id,
            };
            return item;
          });
        })
      )
      .subscribe((query) => {
        this.subCategories = query;
      });
  }
  // get all inner category according seleted sub category.................
  getInnerCategories(sub_id) {
    this.innerCatSubs = this.service
      .getInnerCategories(sub_id)
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const item: InnerCategory = {
              data: a.payload.doc.data() as InnerCategoryData,
              id: a.payload.doc.id,
            };
            return item;
          });
        })
      )
      .subscribe((query) => {
        this.innerCategories = query;
      });
  }
  // after select a category from jquery .........................
  selectedCategory(value: Category) {
    this.category = value;
    this.getSubCategories(value.id);
    this.innerCategories = [];
  }

  selectedSubCategory(value: SubCategory) {
    if (
      value &&
      value.data.sub_category &&
      value.data.sub_category !== "none"
    ) {
      this.subCategory = value;

      this.getInnerCategories(value.id);
    } else {
      this.subCategory = {
        id: "",
        data: {
          category_id: "",
          sub_category: "",
          timestamp: "",
        },
      };
      this.innerCategory = {
        id: "",
        data: {
          sub_category_id: "",
          inner_category: "",
          timestamp: "",
        },
      };
    }
  }
  // after select a inner category from jquery .........................

  selectedInnerCategory(inner: InnerCategory) {
    if (
      !inner ||
      !inner.data.inner_category ||
      inner.data.inner_category == "none"
    ) {
      this.innerCategory = {
        id: "",
        data: {
          sub_category_id: "",
          inner_category: "",
          timestamp: "",
        },
      };
    } else {
      this.innerCategory = inner;
    }
  }
  // category selection initilization for jquery to work click event .........................

  onChange(value) {}

  selectColor(good: VariationGood, item: Color) {
    good.color = item.name;
  }

  selectedDeliveryType: Delivery;
  selectDelivery(i: number) {
    this.selectedDeliveryType = this.deliveryTypes[i];
  }

  makeName(mimeType: string, uid: any): string {
    const timestamp = Number(new Date());
    return uid + "_product_photo_" + timestamp + "." + mimeType;
  }
  onBrowseMainVideo(event: any) {
    let videoFile = event.target.files[0];
    console.log(event);

    if (videoFile.size / 1000 / 1000 <= 30) {
      console.log(videoFile.size);

      this.mainVideo = this.mainVideo || "video_" + Number(new Date()) + ".mp4";
      var reader = new FileReader();
      reader.readAsDataURL(videoFile);
      reader.onload = (event) => {
        this.mainVideoData.base64 = (<FileReader>event.target).result;
        this.mainVideoData.file = videoFile;
        this.testVideo.next((<FileReader>event.target).result);
      };
    } else {
      this.util.showAlert(
        "Warning!",
        "Video galite ikelti tik mp4 formatu ir iki 30mb"
      );
    }
  }
  onBrowseMainImage(event: any) {
    this.addNormalImage(event);
  }
  onBrowseAditionalImage(event: any) {}

  addNormalImage(event) {
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let size = Number(files[i].size / 1000);
      let imageFile = files[i];
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let imageName = this.makeName("webp", this.me.uid);
        let imageData = e.target.result;

        let image = {
          imageForView: imageData,
          base64String: imageData,
          format: "webp",
          name: imageName,
        };
        this.mainImagesData.push(image);
        this.mainImages.push(imageName);
      };
      reader.readAsDataURL(imageFile);
    }
  }

  clickInput(i: any) {
    const id = "browselogo_" + i;
    const el = document.getElementById(id);
    if (el) {
      el.click();
    }
  }

  async showWarning() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Užpildykite visus laukelius!!!",
      message: "Patikrinkite laukelius...",
      mode: "ios",
      buttons: [
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });
    alert.present();
  }

  removeMain(index: number) {
    this.mainImages.splice(index, 1);
    this.mainImagesData.splice(index, 1);
  }
  removeAditional(index: number) {
    this.aditionalImages.splice(index, 1);
    this.aditionalImagesData.splice(index, 1);
  }

  async doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    let from = event?.detail.from;
    let to = event?.detail.to;
    let temp = this.measures[from];
    this.measures[from] = this.measures[to];
    this.measures[to] = temp;
    this.measures = event.detail.complete(this.measures);
    // this.isReordered = true;
  }

  setDefaultMat(i) {
    let tmp = this.variationGoods[0];
    this.variationGoods[0] = this.variationGoods[i];
    this.variationGoods[i] = tmp;
  }

  back() {
    this.navController.navigateRoot("profile/products");
  }

  // editor: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: "15rem",
  //   minHeight: "5rem",
  //   placeholder: "Enter text here...",
  //   translate: "no",
  //   defaultParagraphSeparator: "p",
  //   defaultFontName: "Arial",
  //   toolbarHiddenButtons: [["bold"]],
  // };

  deliveryChanged() {
    if (this.deliveryTypes[0].delivery_info.option == "free") {
      this.deliveryTypes[0].delivery_info.price = "0";
    }
  }
  deliveryChanged1() {
    if (this.deliveryTypes[1].delivery_info.option == "free") {
      this.deliveryTypes[1].delivery_info.price = "0";
    }
  }

  onDeliveryTimeChange() {
    this.deliveryTypes[1].delivery_info.delivery_time =
      this.deliveryTypes[0].delivery_info.delivery_time;
  }

  deleteVideo() {
    this.mainVideoData = null;
  }
}
