import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, lastValueFrom, map } from "rxjs";
import { REELS, REELS_COMMENTS, REELS_LIKES } from "src/app/constants";
import { Reel, ReelComment, ReelLike } from "src/app/models/reels.model";
import { User } from "src/app/models/user";
import {
  getFirestoreDecrement,
  getFirestoreIncrement,
  getTimestamp,
} from "src/app/services/functions/functions";

@Injectable({
  providedIn: "root",
})
export class ReelsService {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public showProgress = new BehaviorSubject(false);
  public selectedIndex: number = 0;
  public reels: Reel[] = [];
  public myReels: Reel[] = [];
  public thumbData;
  public noData = false;
  private uploadUrl = `https://api.cloudinary.com/v1_1/ddvayajgr/video/upload`;
  private destroyUrl = `https://api.cloudinary.com/v1_1/ddvayajgr/video/destroy`;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  public getAllReels() {
    this.firestore
      .collection(REELS, (ref) => ref.orderBy("timestamp", "desc"))
      .get()
      .pipe(
        map((actions) => {
          return actions.docs.map((a) => {
            const data = a.data() as Reel;
            return { ...data, id: a.id } as Reel;
          });
        })
      )
      .subscribe((res) => {
        this.reels = res;
      });
  }

  public async getPreferredReels() {
    this.reels = await lastValueFrom(
      this.firestore
        .collection(REELS, (ref) => ref.orderBy("timestamp", "desc"))
        .get()
        .pipe(
          map((actions) => {
            return actions.docs.map((a) => {
              const data = a.data() as Reel;
              return { ...data, id: a.id } as Reel;
            });
          })
        )
    );
  }

  public async getPreferredUserReels(uid: string) {
    this.myReels = await lastValueFrom(
      this.firestore
        .collection(REELS, (ref) =>
          ref.where("uid", "==", uid).orderBy("timestamp", "desc")
        )
        .get()
        .pipe(
          map((actions) => {
            return actions.docs.map((a) => {
              const data = a.data() as Reel;
              return { ...data, id: a.id } as Reel;
            });
          })
        )
    );
  }

  public getAllReelsByUid(uid: string) {
    this.noData = false;
    this.myReels = [];
    this.firestore
      .collection(REELS, (ref) =>
        ref.where("uid", "==", uid).orderBy("timestamp", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Reel;
            return { ...data, id: a.payload.doc.id } as Reel;
          });
        })
      )
      .subscribe((res) => {
        this.myReels = res;
        this.noData = res.length === 0;
      });
  }

  async deleteReelById(reelId: string, asset: any) {
    // const apiKey = "684418239256936"; // Replace 'your_api_key' with your Cloudinary API key
    // const apiSecret = "Zo9x6PLOFcRAEyYOlVUpKPAQGLk";
    // const formData = new FormData();

    // formData.append("public_id", asset.public_id);
    // formData.append("timestamp", getTimestamp() + "");
    // formData.append("signature", asset.signature);
    // formData.append("api_key", apiKey);

    // this.http.post(this.destroyUrl, formData).subscribe();
    await this.firestore.collection(REELS).doc(reelId).delete();
  }
  cloudinaryUpload(object: any, me: User, about: string) {
    this.showProgress.next(true);
    const fileName = this.firestore.createId();
    const formData = new FormData();

    formData.append("file", object);
    formData.append("upload_preset", "ml_default");
    formData.append("public_id", `reels/${fileName}`);
    formData.append("quality", "60");

    const req = new HttpRequest("POST", this.uploadUrl, formData, {
      headers: new HttpHeaders(),
      reportProgress: true,
    });

    this.http
      .request(req)
      .pipe(
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.uploadProgress.next(progress);
          } else if (event.body && event.statusText === "OK") {
            return event.body;
          } else {
            return null;
          }
        })
      )
      .subscribe({
        next: async (v) => {
          if (v) {
            const doc: Reel = {
              id: fileName,
              about: about,
              uid: me.uid,
              owner: me,
              likeCount: 0,
              commentCount: 0,
              viewCount: 0,
              followCount: 0,
              thumb: fileName + ".png",
              videoUrl: fileName + ".mp4",
              asset: v,
              timestamp: getTimestamp(),
            };
            await this.firestore.collection(REELS).doc(doc.id).set(doc);
          }
        },
        error: (e) => console.error(e),
        complete: async () => {
          // new CloudinaryVideo('reels/'+fileName).re

          this.showProgress.next(false);
          this.uploadProgress.next(0);
        },
      });
  }
  // uploadVideo(
  //   object: any,
  //   me: User,
  //   about: string,
  //   thumbUrl: any,
  //   isBlob = false
  // ): void {
  //   this.showProgress.next(true);
  //   let file = null;
  //   const fileName = this.firestore.createId();
  //   if (isBlob) {
  //     file = new File([object], fileName);
  //   } else {
  //     file = object;
  //   }

  //   //Starting uploading process
  //   const videoFilePath = `reels/videos/${fileName}.mp4`;
  //   const thumbFilePath = `reels/thumbs/${fileName}.png`;

  //   const uploadTask = this.storage.upload(videoFilePath, file);
  //   uploadTask.percentageChanges().subscribe((progress) => {
  //     this.uploadProgress.next(progress);
  //   });
  //   this.storage.ref(thumbFilePath).putString(thumbUrl, "data_url");
  //   uploadTask
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(async () => {
  //         console.log("Snapshot called");
  //         const doc: Reel = {
  //           id: fileName,
  //           about: about,
  //           uid: me.uid,
  //           owner: me,
  //           likeCount: 0,
  //           commentCount: 0,
  //           viewCount: 0,
  //           followCount: 0,
  //           thumb: fileName + ".png",
  //           videoUrl: fileName + ".mp4",
  //           timestamp: getTimestamp(),
  //         };
  //         await this.firestore.collection(REELS).doc(doc.id).set(doc);
  //         console.log("Reel Doc saved");

  //         this.showProgress.next(false);
  //         this.uploadProgress.next(0);
  //         // this.nav.navigateBack("/", {
  //         //   animated: true,
  //         //   animationDirection: "back",
  //         // });
  //       })
  //     )
  //     .subscribe();
  // }

  public subscribeToLiveMessages(reelId: string) {
    const collection = this.firestore
      .collection(REELS)
      .doc(reelId)
      .collection(REELS_COMMENTS, (ref) => ref.orderBy("timestamp", "desc"));
    return collection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          return {
            ...a.payload.doc.data(),
            id: a.payload.doc.id,
          } as ReelComment;
        })
      )
    );
  }

  public async sendLike(reelId: string, me: User) {
    const id = me.uid;
    const timestamp = getTimestamp();
    const likeData: ReelLike = {
      id: id,
      likedBy: me,
      timestamp: timestamp,
    };
    const likeIncreament = getFirestoreIncrement();
    const batch = this.firestore.firestore.batch();
    batch.set(
      this.firestore.collection(REELS).doc(reelId).ref,
      { likeCount: likeIncreament },
      { merge: true }
    );
    batch.set(
      this.firestore
        .collection(REELS)
        .doc(reelId)
        .collection(REELS_LIKES)
        .doc(id).ref,
      likeData,
      { merge: true }
    );
    await batch.commit();
  }

  public async removeLike(reelId: string, me: User) {
    const id = me.uid;

    const likeDecreament = getFirestoreDecrement();
    const batch = this.firestore.firestore.batch();
    batch.set(
      this.firestore.collection(REELS).doc(reelId).ref,
      { likeCount: likeDecreament },
      { merge: true }
    );
    batch.delete(
      this.firestore
        .collection(REELS)
        .doc(reelId)
        .collection(REELS_LIKES)
        .doc(id).ref
    );
    await batch.commit();
  }

  public async isLiked(reelId: string, myUid: string) {
    const query = await lastValueFrom(
      this.firestore
        .collection(REELS)
        .doc(reelId)
        .collection(REELS_LIKES)
        .doc(myUid)
        .get()
    );
    return query.exists;
  }

  public async sendMessage(messageText: string, reelId: string, me: User) {
    const messageId = this.firestore.createId();
    const timestamp = getTimestamp();
    const message: ReelComment = {
      from: me,
      body: messageText,
      timestamp: timestamp,
      type: 1,
      id: messageId,
      likeCount: 0,
      replies: [],
    };
    const doc = this.firestore.collection(REELS).doc(reelId);
    const batch = this.firestore.firestore.batch();
    batch.set(doc.ref, { commentCount: getFirestoreDecrement() });
    batch.set(doc.collection(REELS_COMMENTS).doc(messageId).ref, message);
    await batch.commit();
  }
}
