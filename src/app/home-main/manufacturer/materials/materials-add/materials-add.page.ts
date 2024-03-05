import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { material_image_base } from "../../../../constants";
import { Category, SubCategory } from "../../../../models/category";
import { Image } from "../../../../models/product";
import { User } from "../../../../models/user";
import { AwsUploadService } from "../../../../services/aws-upload.service";
import { UtilityService } from "../../../../services/utility.service";
import { MaterialsService } from "../materials.service";
import { getUser } from "../../../../services/functions/functions";
import { MaterialsCategoryPopoverPage } from "src/app/components/popovers/materials-category-popover/materials-category-popover.page";
import { first } from "rxjs/operators";

@Component({
  selector: "app-materials-add",
  templateUrl: "./materials-add.page.html",
  styleUrls: ["./materials-add.page.scss"],
})
export class MaterialsAddPage implements OnInit, OnDestroy {
  name: string = "";
  code: string[] = [];
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
      sub_category: "",
      timestamp: "",
      category_id: "",
    },
  };
  categories: Category[];
  subCategories: SubCategory[];
  me: User;
  images: string[];
  imagesDatas: Image[];

  materialId: string;

  checked = false;
  categoryName: string = "";
  subCategoryName: string = "";
  catSubs: any;
  subCatSubs: any;

  constructor(
    private service: MaterialsService,
    private modalController: ModalController,
    private nav: NavController,
    private activatedRoute: ActivatedRoute,
    private awsUpload: AwsUploadService,
    private utils: UtilityService
  ) {}
  ngOnDestroy(): void {
    if (this.catSubs) this.catSubs.unsubscribe();
    if (this.subCatSubs) this.subCatSubs.unsubscribe();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(first()).subscribe((queryParams) => {
      if (queryParams && queryParams.id) {
        this.materialId = queryParams.id;
      }
      this.images = [];
      this.imagesDatas = [];
      getUser().then((user: User) => {
        this.me = user;
        if (this.materialId && this.me) {
          this.onEditMaterial(this.me.uid, this.materialId);
        }
        this.catSubs = this.service
          .getCategories(user.uid)
          .subscribe((query) => {
            this.categories = [];
            query.forEach((item) => {
              let data = item.payload.doc.data();
              this.categories.push({
                id: data.data.category,
                data: {
                  category: data.data.category,
                  timestamp: data.data.timestamp,
                  products_count: 0,
                },
              });
            });
          });
      });
    });
  }

  onEditMaterial(uid: string, id: string) {
    this.service
      .getSingleMaterial(uid, id)
      .pipe(first())
      .subscribe((query) => {
        let data = query.data();

        if (data?.category) {
          this.category = {
            id: data?.category?.id,
            data: {
              category: data?.category?.data?.category,
              timestamp: data?.category?.data?.timestamp,
              products_count: 0,
            },
          };
        }
        if (data?.sub_category) {
          this.subCategory = {
            id: data?.sub_category?.id,
            data: {
              sub_category: data?.sub_category?.data?.sub_category,
              timestamp: data?.sub_category?.data?.timestamp,
              category_id: this.category.id,
            },
          };
        }

        this.categoryName = this.category.data.category;
        this.selectedCategory();
        this.images.push(data?.images);
        this.images.forEach((img) => {
          this.imagesDatas.push({
            imageForView: img.includes("https://")
              ? img
              : material_image_base + img,
            name: img,
            base64String: "",
            format: "",
          });
        });
        this.code.push(data?.code);
        this.name = data?.name;
      });
  }
  save() {
    if (
      this.name.trim() !== "" &&
      this.code.length > 0 &&
      this.category &&
      this.category.data.category &&
      this.category.data.category !== "" &&
      this.images.length != 0 &&
      this.me
    ) {
      if (this.materialId) {
        this.utils.present("Medžiaga atnaujinama...");
        let imageForUpload: Image[] = [];
        this.imagesDatas.forEach((img) => {
          if (img.base64String && img.base64String !== "") {
            imageForUpload.push(img);
          }
        });
        let uploaded = 0;
        if (imageForUpload.length > 0) {
          imageForUpload.forEach((img) => {
            this.awsUpload
              .uploadImage("material_photos", img.name, img.base64String)
              .then((res: any) => {
                uploaded++;
                if (uploaded == imageForUpload.length) {
                  let m;
                  this.code.forEach((c, i) => {
                    const timestamp = new Date().getTime();
                    m = {
                      category: this.category,
                      sub_category: this.subCategory,
                      code: this.code[i],
                      id: "",
                      images: this.images[i],
                      name: this.name,
                      timestamp: timestamp + "",
                    };
                    this.service
                      .updateMaterials(this.me.uid, m, this.materialId)
                      .then(() => {
                        this.utils.dismiss();
                        this.service
                          .showToast("Pridėta sėkmingai", "primary")
                          .then(() => {
                            this.nav.navigateBack("profile/materials");
                          });
                      })
                      .catch((err) => {
                        this.utils.dismiss();
                        this.utils.showAlert("Error 4", err);
                        console.log(err);
                      });
                  });
                }

                this.utils.dismiss();
              })
              .catch(async (err) => {
                await this.utils.dismiss().then(async () => {
                  await this.utils.showAlert("Klaida", "Įvyko klaida");
                });
              });
          });
        } else {
          let m;
          this.code.forEach((c, i) => {
            const timestamp = new Date().getTime();
            m = {
              category: this.category,
              sub_category: this.subCategory,
              code: this.code[i],
              id: "",
              images: this.images[i],
              name: this.name,
              timestamp: timestamp + "",
            };
            this.service
              .updateMaterials(this.me.uid, m, this.materialId)
              .then(() => {
                this.utils.dismiss();
                this.service
                  .showToast("Pridėta sėkmingai", "primary")
                  .then(() => {
                    this.nav.navigateBack("profile/materials");
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => {
                console.log(err);
                this.utils.dismiss();
              });
          });
        }
      } else {
        this.utils.present("Pridedama medžiaga...");
        let uploaded = 0;
        this.imagesDatas.forEach((img) => {
          this.awsUpload
            .uploadImage("material_photos", img.name, img.base64String)
            .then((res: any) => {
              uploaded++;
              if (uploaded == this.imagesDatas.length) {
                let m;
                this.code.forEach((c, i) => {
                  const timestamp = new Date().getTime();
                  m = {
                    category: this.category,
                    sub_category: this.subCategory,
                    code: this.code[i],
                    id: "",
                    images: this.images[i],
                    name: this.name,
                    timestamp: timestamp + "",
                  };
                  this.service
                    .addMaterials(this.me.uid, m)
                    .then(() => {
                      this.utils.dismiss();
                      this.service
                        .showToast("Pridėta sėkmingai", "primary")
                        .then(() => {
                          this.nav.navigateBack("profile/materials");
                        });
                    })
                    .catch((err) => {
                      this.utils.showAlert("Error 1", err);
                      this.utils.dismiss();
                    });
                });
              }
            })
            .catch(async (err) => {
              await this.utils.dismiss().then(async () => {
                await this.utils.showAlert("Klaida!", "Įkėlimo klaida...");
              });
            });
        });
      }
    } else {
      this.checked = true;
      this.utils.showAlert("Privaloma", "Visi laukeliai turi būti užpildyti.");
    }
  }

  makeName(mimeType: string, uid: any): string {
    const timestamp = new Date().getTime();
    return uid + "_material_photo_" + timestamp + "." + mimeType;
  }

  onBrowseImage(event: any) {
    this.addAllImage(event);
  }

  async addAllImage(event: any) {
    let files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      let imageFile = files[i]; // direct use for amazon upload
      let size = Number(files[i].size / 1000);
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let imageName = this.makeName("webp", this.me.uid);
        let imageData = e.target.result; // use for temporary vesta panel server upload

        let image = {
          imageForView: imageData,
          base64String: imageData,
          format: "webp",
          name: imageName,
        };
        this.imagesDatas.push(image);
        this.images.push(imageName);
        this.code.push("");
      };
      reader.readAsDataURL(imageFile);
    }
  }

  //open category add modal
  async openAddCategoryPopover() {
    const modal = await this.modalController.create({
      component: MaterialsCategoryPopoverPage,
      animated: true,
      backdropDismiss: true,
      cssClass: "category-add-modal",
    });
    await modal.present();
  }

  selectedSubCategory() {
    if (this.subCategoryName) {
      this.subCategory = {
        id: this.subCategoryName,
        data: {
          sub_category: this.subCategoryName,
          timestamp: "",
          category_id: this.categoryName,
        },
      };
    }
  }

  // after select a category from jquery .........................
  selectedCategory() {
    if (this.categoryName) {
      this.category = {
        data: {
          category: this.categoryName,
          timestamp: "",
          products_count: 0,
        },
        id: this.categoryName,
      };
      this.subCatSubs = this.service
        .getSubCategories(this.me.uid, this.categoryName)
        .subscribe((query) => {
          this.subCategories = [];
          query.forEach((item) => {
            let data = item.payload.doc.data();
            this.subCategories.push({
              id: data?.data?.sub_category,
              data: {
                sub_category: data?.data?.sub_category,
                timestamp: data?.data?.timestamp,
                category_id: data?.data?.category_id,
              },
            });
          });
        });
    }
  }
  // category selection initilization for jquery to work click event .........................

  changeCode(e) {
    let code = e.target.value.trim();
    this.code.push(code);
  }

  back() {
    this.nav.back();
  }
}
