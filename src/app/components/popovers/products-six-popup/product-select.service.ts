import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { categories, products, subcategories } from "../../../constants";

@Injectable({
  providedIn: "root",
})
export class ProductSelectService {
  constructor(private firestore: AngularFirestore) {}

  getAllProducts(uid: string, startAfter: QueryDocumentSnapshot<any>) {
    if (startAfter) {
      return this.firestore
        .collection(products)
        .doc(uid)
        .collection(products, (ref) => ref.startAfter(startAfter).limit(20))
        .get();
    }
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(products, (ref) => ref.limit(20))
      .get();
  }

  getProductsByCategory(
    uid: string,
    category_id: string,
    startAfter: QueryDocumentSnapshot<any>
  ) {
    if (startAfter) {
      return this.firestore
        .collection(products)
        .doc(uid)
        .collection(products, (ref) =>
          ref
            .where("category.id", "==", category_id)
            .startAfter(startAfter)
            .limit(20)
        )
        .get();
    } else {
      return this.firestore
        .collection(products)
        .doc(uid)
        .collection(products, (ref) =>
          ref.where("category.id", "==", category_id).limit(20)
        )
        .get();
    }
  }

  getProductsByCategorySubCategory(
    uid: string,
    category_id: string,
    sub_id: string,
    startAfter: QueryDocumentSnapshot<any>
  ) {
    if (startAfter) {
      return this.firestore
        .collection(products)
        .doc(uid)
        .collection(products, (ref) =>
          ref
            .where("category.id", "==", category_id)
            .where("sub_category.id", "==", sub_id)
            .startAfter(startAfter)
            .limit(20)
        )
        .get();
    }
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(products, (ref) =>
        ref
          .where("category.id", "==", category_id)
          .where("sub_category.id", "==", sub_id)
          .limit(20)
      )
      .get();
  }

  getProductsByKeyword(uid: string, keyword: string) {
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(products, (ref) =>
        ref
          .where("title", ">=", keyword)
          .where("title", "<=", keyword + "\uf8ff")
          .limit(10)
      )
      .snapshotChanges();
  }

  getCategories(myUid: string) {
    return this.firestore
      .collection(categories, (ref) => ref.orderBy("timestamp", "desc"))
      .snapshotChanges();
  }
  getSubCategories(myUid: string, catId: string) {
    return this.firestore
      .collection(subcategories, (ref) =>
        ref.where("category_id", "==", catId).orderBy("timestamp", "desc")
      )
      .snapshotChanges();
  }
}
