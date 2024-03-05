import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { User } from "../../../models/user";
import { Material } from "../../../models/material";
import { MaterialsService } from "./materials.service";
import { categories, materials, subcategories } from "../../../constants";
import { NavigationExtras } from "@angular/router";
import {
  AlertController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  Category,
  CategoryForProductAdd,
  SubCategory,
  SubCategoryForProductAdd,
} from "../../../models/category";
import { ApiInstructionsPage } from "./api-instructions/api-instructions.page";
import { AwsUploadService } from "../../../services/aws-upload.service";
import { Observable, Subscription } from "rxjs";
import { getUser } from "src/app/services/functions/functions";
import { first } from "rxjs/operators";

interface MaterialExtra extends Material {
  selected: boolean;
  price: string;
}
@Component({
  selector: "app-materials",
  templateUrl: "./materials.page.html",
  styleUrls: ["./materials.page.scss"],
})
export class MaterialsPage implements OnInit, OnDestroy {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  userType: any;
  isLoggedIn = false;
  materials: Material[];
  categories: CategoryForProductAdd[] = [];
  me: User;
  selectedMaterials;
  materials$: Observable<Material[]>;
  matByCatSubs: Subscription;
  matByCatSubCatSubs: Subscription;
  matByCatsSub: Subscription;

  constructor(
    public materialsService: MaterialsService,
    private navController: NavController,
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private popoverController: PopoverController,
    private awsUploadService: AwsUploadService
  ) {}
  ngOnDestroy(): void {
    if (this.matByCatSubs) this.matByCatSubs.unsubscribe();
    if (this.matByCatSubCatSubs) this.matByCatSubCatSubs.unsubscribe();
    if (this.matByCatsSub) this.matByCatsSub.unsubscribe();
  }

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        this.userType = user.rule;
        this.isLoggedIn = true;
        this.me = user;
        this.profileCheckEvent.emit(true);
        this.materialsService.getMaterialsCalled = false;
        this.materialsService.startAfter = null;
        this.materialsService.materials = [];
        this.materialsService.getMaterials(user.uid);
        this.getCategories(this.me.uid);
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  async openApiInstructions() {
    const popover = await this.popoverController.create({
      component: ApiInstructionsPage,
      animated: true,
      backdropDismiss: true,
      cssClass: "api-instructions",
      keyboardClose: true,
      mode: "ios",
    });

    return await popover.present();
  }

  getCategories(uid: string) {
    this.angularFirestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .get()
      .pipe(first())
      .subscribe((query) => {
        query.forEach((item) => {
          let id = item.id;
          let data = item.data() as Category;
          this.angularFirestore
            .collection(materials)
            .doc(uid)
            .collection(categories)
            .doc(id)
            .collection(subcategories)
            .get()
            .pipe(first())
            .subscribe((query2) => {
              let subCate: SubCategoryForProductAdd[] = [];
              query2.forEach((item2) => {
                let sId = item2.id;
                let sData = item2.data() as SubCategory;
                subCate.push({
                  id: sId,
                  isSelected: false,
                  data: sData.data,
                });
              });
              this.categories.push({
                id: id,
                isSelected: false,
                subCategories: subCate,
                data: data.data,
              });
            });
        });
      });
  }

  getMaterialsByCategories(
    cat: CategoryForProductAdd,
    sub: SubCategoryForProductAdd
  ) {
    this.categories.forEach((c) => {
      if (c.id !== cat.id) {
        c.isSelected = false;
        c.subCategories.forEach((s) => {
          s.isSelected = false;
        });
      }
    });

    if (cat && !sub) {
      cat.isSelected = !cat.isSelected;
      if (cat.isSelected) {
        this.matByCatSubs = this.materialsService
          .getMaterialsByCategory(this.me.uid, cat.id)
          .subscribe((query) => {
            this.materialQueryExecution(query);
          });
      } else {
        this.materialsService.startAfter = null;
        this.materialsService.materials = [];
        this.materialsService.getMaterials(this.me.uid);
      }
    }
    if (sub) {
      sub.isSelected = !sub.isSelected;

      if (sub.isSelected) {
        this.matByCatSubCatSubs = this.materialsService
          .getMaterialsByCategorySubcategory(this.me.uid, cat.id, sub.id)
          .subscribe((query) => {
            this.materialQueryExecution(query);
          });
      } else {
        this.matByCatsSub = this.materialsService
          .getMaterialsByCategory(this.me.uid, cat.id)
          .subscribe((query) => {
            this.materialQueryExecution(query);
          });
      }
    }
  }

  materialQueryExecution(query: any) {
    this.materialsService.materials = [];
    query.forEach((item) => {
      let data = item.payload.doc.data();
      let material: MaterialExtra = {
        category: data.category,
        code: data.code,
        id: data.id,
        images: data.images,
        name: data.name,
        price: "",
        selected: false,
        sub_category: data.sub_category,
        timestamp: data.timestamp,
      };
      this.selectedMaterials = [];
      this.materialsService.materials.push(material);
    });
  }

  async findMaterials(event) {
    this.materialsService.getMaterials(this.me.uid);
    setTimeout(async () => {
      event.target.complete();
    }, 100);
  }

  async askPermissionForDelete(material: Material, i: number) {
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
            this.deleteMaterial(material, i);
          },
        },
      ],
    });
    alert.present();
  }

  async deleteMaterial(material: Material, i: number) {
    if (material && material.images != "") {
      this.awsUploadService.removeImages("material_photos", [material.images]);
      await this.materialsService
        .deleteMaterial(this.me.uid, material)
        .then(async () => {
          this.materialsService.materials.splice(i, 1);
          await this.materialsService.showToast(
            "Sėkmingai pašalintas",
            "danger"
          );
        });
    }
  }
  onEditMaterial(id: string) {
    let navExtra: NavigationExtras = {
      queryParams: {
        id: id,
      },
    };
    this.navController.navigateForward("materials-add", navExtra);
  }
}
