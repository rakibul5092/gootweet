import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BASE_URL, products, wallpost } from "../../constants";
import { DesignerWallPostData, WallPostData } from "../../models/wall-test";

@Injectable({
  providedIn: "root",
})
export class AddWallPostService {
  constructor(private http: HttpClient, private firestore: AngularFirestore) {}
  uploadPhoto(postData: any) {
    const END_URL = "upload_wall_post_photos.php";
    return this.http.post(BASE_URL + END_URL, postData);
  }

  generateWallId() {
    return this.firestore.createId();
  }

  saveWallPost(wallPost: WallPostData, postId: string) {
    return this.firestore
      .collection(wallpost)
      .doc(postId)
      .set(wallPost, { merge: true });
  }
  updateWallPost(wallPost: WallPostData, postId: string) {
    return this.firestore.collection(wallpost).doc(postId).update(wallPost);
  }
  updateWallPostIsPaid(postId: string, isPaid: boolean) {
    return this.firestore
      .collection(wallpost)
      .doc(postId)
      .update({ isPaid: isPaid });
  }
  updateWallPostNotPaid(postId: string, isPaid: boolean) {
    return this.firestore
      .collection(wallpost)
      .doc(postId)
      .update({ isPaid: isPaid });
  }

  saveDesignerWallPost(wallPost: DesignerWallPostData) {
    return this.firestore.collection(wallpost).add(wallPost);
  }

  updateDesignerWallPost(wallPost: DesignerWallPostData, postId: string) {
    return this.firestore.collection(wallpost).doc(postId).update(wallPost);
  }
  getRelatedProducts(uid: string) {
    return this.firestore
      .collection(products)
      .doc(uid)
      .collection(products, (ref) => ref.limit(5))
      .snapshotChanges();
  }

  getWallPostById(postId: string) {
    return this.firestore.collection<WallPostData>(wallpost).doc(postId).get();
  }
}
