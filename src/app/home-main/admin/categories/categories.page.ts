import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { first } from "rxjs/operators";
import {
  categories,
  CATEGORY_IMAGE_BASE,
  cloud_function_base_url,
  innercategories,
  subcategories,
  SUB_CATEGORY_IMAGE_BASE,
} from "src/app/constants";
import { Category } from "src/app/models/category";
import { AwsUploadService } from "src/app/services/aws-upload.service";
import { getUser } from "src/app/services/functions/functions";
import { ModalService } from "src/app/services/modal.service";
import { UtilityService } from "src/app/services/utility.service";
import { User } from "../../../models/user";
import { CatModalComponent } from "./cat-modal/cat-modal.component";
import { CategoriesPopupPage } from "./categories-popup/categories-popup.page";
import { CategoriesService } from "./categories.service";
import { EditCategoryPage } from "./edit-category/edit-category.page";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  isLoggedIn = false;
  userType: string;
  me: User;

  from: Category;
  to: Category;
  baseUrl = CATEGORY_IMAGE_BASE;
  subBaseUrl = SUB_CATEGORY_IMAGE_BASE;

  constructor(
    public service: CategoriesService,
    private alertController: AlertController,
    private modalService: ModalService,
    private modalCntrl: ModalController,
    private aws: AwsUploadService,
    private util: UtilityService,
    private loginService: LoginService
  ) {}

  setTo(cat: Category, i: number, event) {
    if (event.detail.value == "To") {
      this.service.categories[i].to = cat;
      this.service.categories[i].from = null;
      this.to = cat;
      this.deselectOther(false, i);
    } else if (event.detail.value == "From") {
      this.service.categories[i].from = cat;
      this.service.categories[i].to = null;
      this.from = cat;
      this.deselectOther(true, i);
    } else {
      this.service.categories[i].from = null;
      this.service.categories[i].to = null;
    }
  }
  async saveSubIcon(sub) {
    await this.service.saveIcon(subcategories, sub.id, sub.data.icon);
  }
  async onSubImageChange(event, subId) {
    if (event.target.files[0].type.includes("image")) {
      let imageFile = event.target.files[0];
      let reader = new FileReader();
      reader.onload = async (e: any) => {
        const imageName = subId + ".png";
        const imageData = e.target.result;

        await this.util.present("Uploading...");
        this.aws
          .uploadImage("subcategories", imageName, imageData)
          .then(async (f) => {
            await this.service.updateSubImage(subId, imageName);
            await this.util.dismiss();
          });
      };
      reader.readAsDataURL(imageFile);
    }
  }
  choosePhoto(id) {
    document.getElementById("sub-" + id).click();
  }
  async saveInnerIcon(inner) {
    await this.service.saveIcon(innercategories, inner.id, inner.data.icon);
  }
  async doOrder(event) {
    // new order of items
    const from =
      this.service.categories[event?.detail.from].category.data.serial;
    const to = this.service.categories[event?.detail.to].category.data.serial;
    const catIdFrom = this.service.categories[event?.detail.from].category.id;
    const catIdTo = this.service.categories[event?.detail.to].category.id;
    await this.service.swapCat(from, catIdFrom, to, catIdTo);

    this.service.categories = event.detail.complete(this.service?.categories);
  }

  async changeImageModal(cat) {
    const modal = await this.modalCntrl.create({
      component: CatModalComponent,
      componentProps: { catId: cat.id },
      animated: true,
      backdropDismiss: true,
      mode: "ios",
      keyboardClose: true,
      swipeToClose: true,
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        cat.data.img = res.data.img;
      }
    });
    await modal.present();
  }

  submitChange() {
    const url =
      cloud_function_base_url +
      "/changeCategory?old_id=" +
      this.from.data.category +
      "&update_id=" +
      this.to.data.category;
    // this.service
    //   .initChangeSubmit(url)
    //   .pipe(first())
    //   .subscribe((res: any) => {
    //     if (res.status) {
    //       this.deselectAll();
    //       this.service.util.showToast(
    //         "Submitted success, please wait for complete.",
    //         "success"
    //       );
    //     }
    //   });
  }

  deselectOther(isFrom: boolean, i: number) {
    this.service.categories.forEach((item, index) => {
      if (i !== index) {
        if (isFrom) {
          this.service.categories[index].from = null;
        } else {
          this.service.categories[index].to = null;
        }
      }
    });
  }
  deselectAll() {
    this.service.categories.forEach((item, index) => {
      this.service.categories[index].from = null;
      this.service.categories[index].to = null;
    });
  }

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      if (user) {
        this.userType = user.rule;
        this.isLoggedIn = true;
        this.me = user;
        this.service.init(user);
      } else {
        this.isLoggedIn = true;
      }
    });
  }

  async openAddCategoryPopover() {
    this.modalService.presentModal(
      CategoriesPopupPage,
      null,
      "category-add-modal",
      "ios",
      false
    );
  }
  async openUpdateCategory(item: any, type: number) {
    let data = {
      item: item,
      type: type,
    };

    const modal = await this.modalService.createModal(
      EditCategoryPage,
      data,
      "edit-category",
      "ios"
    );
    modal.onDidDismiss().then((res) => {
      if (res && res.data) {
        if (data.type == 1) {
          this.service.updateCat(res.data.old, res.data.update);
        } else if (data.type == 2) {
          this.service.updateSub(res.data.old, res.data.update);
        } else if (data.type == 3) {
          this.service.updateInner(res.data.old, res.data.update);
        }
      }
    });
    return await modal.present();
  }

  async askDeletePermission(obj: any, type: number) {
    if (obj.product_count > 0) {
      const alert = await this.alertController.create({
        animated: true,
        backdropDismiss: true,
        keyboardClose: true,
        header: "Klaida!",
        message: "Kategorija nėra tuščia?",
        mode: "ios",
        buttons: [
          {
            text: "Atšaukti",
            handler: () => {
              this.alertController.dismiss();
            },
          },
        ],
      });
      alert.present();
    } else {
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
              if (type == 1) {
                this.service.deleteCategory(obj);
              } else if (type == 2) {
                this.service.deleteSubCategory(obj);
              } else if (type == 3) {
                this.service.deleteInnerCategory(obj);
              }
            },
          },
        ],
      });
      alert.present();
    }
  }
}
