import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable, Subscription, lastValueFrom } from "rxjs";
import { followed, users } from "../../constants";
import { Follow } from "../../models/follow";
import { User } from "../../models/user";
import { WallPost, WallPostData } from "../../models/wall-test";
import { UtilityService } from "../../services/utility.service";
import { getWhoTyping } from "../../services/functions/wall_post_functions";
import { first, map } from "rxjs/operators";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
} from "src/app/services/functions/functions";

@Injectable({
  providedIn: "root",
})
export class FollowService {
  wallPosts: WallPost[] = [];
  constructor(
    private firestore: AngularFirestore,
    private util: UtilityService
  ) {}

  getFollowed(uid: string) {
    return this.firestore
      .collection(followed)
      .doc(uid)
      .collection(followed, (ref) => ref.limit(5).orderBy("timestamp", "desc"))
      .snapshotChanges();
  }
  getFollowedUserData(uid: string) {
    return this.firestore.collection(users).doc(uid).snapshotChanges();
  }

  isFollowed(ownerUid: string, myUid: string) {
    return this.firestore
      .collection(followed)
      .doc(ownerUid)
      .collection(followed)
      .doc(myUid)
      .snapshotChanges()
      .pipe(
        map((a) => {
          return a.payload.exists ? a.payload.data() : null;
        })
      );
  }

  async addFollow(ownerUid: string, myData: User) {
    let batch = this.firestore.firestore.batch();
    let increment = getFirestoreIncrement();
    batch.set(
      this.firestore
        .collection(followed)
        .doc(ownerUid)
        .collection(followed)
        .doc(myData.uid).ref,
      myData
    );
    batch.set(
      this.firestore.collection(users).doc(ownerUid).ref,
      { followers: increment },
      { merge: true }
    );
    await batch.commit();
  }
  async removeFollows(ownerUid: string, myUid: string) {
    let batch = this.firestore.firestore.batch();
    let decrement = getFirestoreDecrement();
    batch.delete(
      this.firestore
        .collection(followed)
        .doc(ownerUid)
        .collection(followed)
        .doc(myUid).ref
    );
    batch.set(
      this.firestore.collection(users).doc(ownerUid).ref,
      { followers: decrement },
      { merge: true }
    );
    await batch.commit();
  }
  private followedSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);

  private nextQueryAfter: QueryDocumentSnapshot<WallPostData>;

  private paginationSub: Subscription;
  private findSub: Subscription;

  destroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }

    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  watchFollowedUser(): Observable<User[]> {
    return this.followedSubject.asObservable();
  }

  myUid: string;
  isFindCalled = false;
  find(followedList: Follow[], myUid: string) {
    if (this.isFindCalled) {
      return;
    }
    this.isFindCalled = true;
    try {
      let collection: AngularFirestoreCollection<WallPostData> =
        this.getCollectionQuery();
      this.myUid = myUid;
      this.unsubscribe();

      this.query(collection, followedList);
    } catch (err) {
      throw err;
    }
  }

  private getCollectionQuery(): AngularFirestoreCollection<WallPostData> {
    if (this.nextQueryAfter) {
      return this.firestore.collection<WallPostData>("wall_post", (ref) =>
        ref
          .orderBy("timestamp", "desc")
          .startAfter(this.nextQueryAfter)
          .limit(5)
      );
    } else {
      return this.firestore.collection<WallPostData>("wall_post", (ref) =>
        ref.orderBy("timestamp", "desc").limit(5)
      );
    }
  }

  private query(
    collection: AngularFirestoreCollection<WallPostData>,
    followedList: Follow[]
  ) {
    try {
      this.findSub = collection
        .get()
        .pipe(first())
        .subscribe((query) => {
          if (query && query.docs.length > 0) {
            this.nextQueryAfter = query.docs[
              query.docs.length - 1
            ] as QueryDocumentSnapshot<WallPostData>;
          } else {
            this.isFindCalled = false;
          }

          query.forEach((item) => {
            let id = item.id;
            let data: WallPostData = item.data() as WallPostData;
            const ref = item.ref;
            let isFollowed = false;
            if (
              followedList.find((item) => {
                return item.uid === data.owner.uid;
              })
            ) {
              this.wallPosts.push({
                data: data,
                id: id,
                shortened: true,
                comments: null,
                isCommentAll: false,
                commentText: "",
                commentForEdit: null,
                whoTyping: getWhoTyping(
                  collection.doc(id).collection("typing").doc("1234567890")
                ),
                collection: collection,
                myUid: this.myUid,
                userCollection: this.firestore.collection(users),
              });
            }
          });
        });
      this.isFindCalled = false;
    } catch (e) {
      console.log(e);
    }
  }
}
