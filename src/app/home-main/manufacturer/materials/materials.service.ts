import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import {
  BASE_URL,
  categories,
  materials,
  subcategories,
} from "../../../constants";
import { Category, SubCategory } from "../../../models/category";
import { Material } from "../../../models/material";

interface MaterialExtra extends Material {
  selected: boolean;
  price: string;
}

@Injectable({
  providedIn: "root",
})
export class MaterialsService implements OnDestroy {
  materials: MaterialExtra[] = [];
  startAfter: QueryDocumentSnapshot<MaterialExtra>;
  private findSub: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private http: HttpClient // private awsRemoveService: AwsRemoveService, // private awsService: AwsUploadService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getCategories(uid: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories, (ref) => ref.orderBy("data.timestamp", "desc"))
      .snapshotChanges();
  }
  getSubCategories(uid: string, cat_id: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .doc(cat_id)
      .collection(subcategories, (ref) => ref.orderBy("data.timestamp", "desc"))
      .snapshotChanges();
  }
  async addCategory(uid: string, catObj: Category) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .doc(catObj.data.category)
      .set(catObj);
  }
  async addSubCategory(uid: string, cat_id: string, subObj: SubCategory) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .doc(cat_id)
      .collection(subcategories)
      .doc(subObj.data.sub_category)
      .set(subObj);
  }
  async deleteCategory(uid: string, cat: Category) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .doc(cat.id)
      .delete();
  }
  async deleteSubCategory(uid: string, cat_id: string, sub_id: string) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(categories)
      .doc(cat_id)
      .collection(subcategories)
      .doc(sub_id)
      .delete();
  }
  getSingleMaterial(uid: string, id: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials)
      .doc(id)
      .get();
  }

  destroy() {
    this.unsubscribe();
    this.materials = [];
    this.startAfter = null;
    this.getMaterialsCalled = false;
  }

  private unsubscribe() {
    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  getMaterialsCalled = false;
  getMaterials(uid: string) {
    if (this.getMaterialsCalled) {
      return;
    }
    this.getMaterialsCalled = true;
    try {
      let collection = this.getMaterialCollection(uid);
      this.unsubscribe();
      this.query(collection);
    } catch (err) {
      throw err;
    }
  }

  getMaterialCollection(uid) {
    if (this.startAfter) {
      return this.firestore
        .collection(materials)
        .doc(uid)
        .collection(materials, (ref) =>
          ref.orderBy("timestamp", "desc").startAfter(this.startAfter).limit(20)
        );
    } else {
      return this.firestore
        .collection(materials)
        .doc(uid)
        .collection(materials, (ref) =>
          ref.orderBy("timestamp", "desc").limit(20)
        );
    }
  }

  query(collection) {
    this.findSub = collection.get().subscribe((query) => {
      if (query && query.docs.length > 0) {
        this.startAfter = query.docs[
          query.docs.length - 1
        ] as QueryDocumentSnapshot<MaterialExtra>;
      }

      query.forEach((item) => {
        this.getMaterialsCalled = false;
        const id = item.id;
        const material: any = item.data();

        this.materials.push({
          category: material?.category,
          sub_category: material?.sub_category,
          code: material.code,
          id: id,
          images: material?.images,
          name: material?.name,
          timestamp: material?.timestamp,
          selected: false,
          price: "",
        });
      });
    });
    this.getMaterialsCalled = false;
  }

  getMaterialsByCategory(uid: string, catId: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials, (ref) => ref.where("category.id", "==", catId))
      .snapshotChanges();
  }

  getMaterialsByCategorySubcategory(uid: string, catId: string, subId: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials, (ref) =>
        ref
          .where("category.id", "==", catId)
          .where("sub_category.id", "==", subId)
      )
      .snapshotChanges();
  }

  getMaterialsByKeyword(uid: string, keyword: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials, (ref) =>
        ref
          .where("name", ">=", "\uf8ff" + keyword + "\uf8ff")
          .where("name", "<=", "\uf8ff" + keyword + "\uf8ff")
          .limit(10)
      )
      .snapshotChanges();
  }

  searchMaterialsByKeyword(keyword: string, uid: string) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials, (ref) =>
        ref
          .orderBy("name")
          .startAt(keyword)
          .endAt(keyword + "\uf8ff")
      );
  }

  async addMaterials(uid: string, matObj: Material) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials)
      .add(matObj);
  }

  async updateMaterials(uid: string, matObj: Material, matId: string) {
    await this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials)
      .doc(matId)
      .update(matObj);
  }

  async deleteMaterial(uid: string, mat: Material): Promise<any> {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials)
      .doc(mat.id)
      .delete();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      animated: true,
      duration: 1000,
      mode: "ios",
      color: color,
    });
    await toast.present();
  }

  uploadPhoto(postData: any) {
    const END_URL = "upload_material_photos.php";
    return this.http.post(BASE_URL + END_URL, postData);
  }

  opentSingleMaterial(uid, id) {
    return this.firestore
      .collection(materials)
      .doc(uid)
      .collection(materials)
      .doc(id);
  }

  // private _materials: BehaviorSubject<Material[]>;
  // matrials: Observable<Material[]>;
  // latestEntry: any;
  // getCollection(ref, queryFn?): Observable<any[]> {
  //   return this.firestore
  //     .collection(ref, queryFn)
  //     .snapshotChanges()
  //     .map(actions => {
  //       return actions.map((a) => {
  //         const data = a.payload.doc.data();
  //         const id = a.payload.doc.id;
  //         const doc = a.payload.doc;
  //         return { id, ...data, doc };
  //       });
  //     });
  // }

  // first() {
  //   this._materials = new BehaviorSubject([]);
  //   this.matrials = this._materials.asObservable();
  //   const matRef = this.getCollection(materials, (ref) =>
  //     ref.orderBy("timestamp", "desc").limit(20)
  //   ).subscribe((data) => {
  //     this.latestEntry = data[data.length - 1].doc;
  //     this._materials.next(data);
  //   });
  // }
  // next() {
  //   const matRef = this.getCollection(
  //     materials,
  //     (ref) =>
  //       ref.orderBy("timestamp", "desc").startAfter(this.latestEntry).limit
  //   ).subscribe((data) => {
  //     if (data.length) {
  //       // And save it again for more queries
  //       this.latestEntry = data[data.length - 1].doc;
  //       this._materials.next(data);
  //     }
  //   });
  // }
}
