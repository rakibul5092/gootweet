import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  categories,
  subcategories,
  innercategories,
  BASE_URL,
  products,
} from "../../../../constants";
import { HttpClient } from "@angular/common/http";
import { LoadingController, ModalController } from "@ionic/angular";
import { Product } from "../../../../models/product";
import { ColorPopoverPage } from "./color-popover/color-popover.page";
import { lastValueFrom, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AddProductService {
  isLoading = false;
  constructor(
    private loadingController: LoadingController,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  async addToCollection(
    isColor = true,
    colors: any[],
    sizes: any[],
    uid: string
  ) {
    let modal = await this.modalController.create({
      component: ColorPopoverPage,
      componentProps: { isColor, colors, sizes, ownerUid: uid },
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      mode: "ios",
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      swipeToClose: true,
      cssClass: "color-pop",
    });
    await modal.present();
  }

  async deleteColorOrSize(item, isColor, uid: string) {
    await this.firestore
      .collection(products)
      .doc(uid)
      .collection(isColor ? "colors" : "sizes")
      .doc(item.id)
      .delete();
  }

  saveDeliveryTypes(uid: string, deliveryTypes: any) {
    this.firestore
      .collection("products")
      .doc(uid)
      .set({ delivery: deliveryTypes })
      .then(() => {
        console.log("save", deliveryTypes);
      });
  }
  async getDeliveryTypes(uid: string): Promise<any> {
    return await lastValueFrom(
      this.firestore.collection("products").doc(uid).get()
    ).then((query: any) => {
      console.log("save", query.data());
      if (query.data()) {
        return query.data()?.delivery ? query.data().delivery : null;
      }
    });
  }

  async addColorOrSize(
    item: string,
    timestamp: any,
    isColor = true,
    uid: string
  ) {
    return await this.firestore
      .collection(products)
      .doc(uid)
      .collection(isColor ? "colors" : "sizes")
      .doc(item)
      .set({ name: item, timestamp: timestamp }, { merge: true });
  }

  getAllColorsOrSizes(uid: string, isColor: boolean) {
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(isColor ? "colors" : "sizes", (ref) =>
        ref.orderBy("timestamp", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            return {
              id: a.payload.doc.id,
              name: (a.payload.doc.data() as any).name,
            };
          });
        })
      );
  }

  addProduct(myUid: string, product: Product) {
    return this.firestore
      .collection(products)
      .doc(myUid)
      .collection(products)
      .add(product);
  }
  getProduct(myUid: string, pid: string) {
    return this.firestore
      .collection(products)
      .doc(myUid)
      .collection(products)
      .doc(pid)
      .get();
  }
  getCategories() {
    return this.firestore
      .collection(categories, (ref) => ref.orderBy("timestamp", "desc"))
      .snapshotChanges();
  }
  getSubCategories(cat_id) {
    return this.firestore
      .collection(subcategories, (ref) =>
        ref.orderBy("timestamp", "desc").where("category_id", "==", cat_id)
      )
      .snapshotChanges();
  }
  getInnerCategories(sub_id) {
    return this.firestore
      .collection(innercategories, (ref) =>
        ref.orderBy("timestamp", "desc").where("sub_category_id", "==", sub_id)
      )
      .snapshotChanges();
  }

  uploadPhoto(postData: any) {
    const END_URL = "upload_product_photos.php";
    return this.http.post(BASE_URL + END_URL, postData);
  }

  async present(message: any) {
    this.isLoading = true;
    let loading = await this.loadingController.create({
      animated: true,
      message: message,
    });
    await loading.present();
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      await this.loadingController
        .dismiss()
        .then(() => console.log("dismissed"));
    }
  }
}
