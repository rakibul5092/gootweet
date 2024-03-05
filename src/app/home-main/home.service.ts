import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject } from "rxjs";
import { wallpost } from "../constants";
import { CategoryForShow } from "../models/category";
import { WallPostData } from "../models/wall-test";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  categorySubject = new BehaviorSubject<CategoryForShow>(null);
  constructor(private angularFirestore: AngularFirestore) {}

  onCategoryClicked(cat: CategoryForShow) {
    console.log(cat);

    this.categorySubject.next(cat);
  }

  getWallpost(
    queryAfter: QueryDocumentSnapshot<WallPostData>
  ): AngularFirestoreCollection<WallPostData> {
    if (queryAfter) {
      return this.angularFirestore.collection(wallpost, (ref) =>
        ref.orderBy("timestamp", "desc").startAfter(queryAfter).limit(10)
      );
    } else {
      return this.angularFirestore.collection(wallpost, (ref) =>
        ref.orderBy("timestamp", "desc").limit(10)
      );
    }
  }
}
