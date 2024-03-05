import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable, of } from "rxjs";
import {
  catchError,
  finalize,
  first,
  ignoreElements,
  map,
} from "rxjs/operators";
import {
  LIVE_PRODUCTS,
  LIVE_STREAMINGS,
  cloud_function_base_url,
  live_chats,
} from "../constants";
import { LiveMessage } from "../models/message";
import { Image, LiveProduct, Product } from "../models/product";
import { User } from "../models/user";
import { getTimestamp } from "./functions/functions";
import { LiveApiResponse, LiveStream } from "../models/video.model";

@Injectable({
  providedIn: "root",
})
export class LiveStreamingService {
  public products: LiveProduct[] = [];
  public liveProduct: LiveProduct;
  public lastVideo = new BehaviorSubject<any>(null);
  public selectedVideo$ = new BehaviorSubject<LiveStream>(null);
  public loading$ = new BehaviorSubject(false);
  public error$: Observable<any>;
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  getVideoList() {
    this.loading$.next(true);
    return this.firestore
      .collection<LiveStream>(LIVE_STREAMINGS, (ref) =>
        ref
          .orderBy("status", "desc")
          .where("status", ">", 0)
          .orderBy("timestamp", "desc")
      )
      .get()
      .pipe(
        map((action) => {
          return action.docs.map((a) => {
            return a.data();
          });
        })
      )
      .pipe(finalize(() => this.loading$.next(false)));
  }

  getVideoListByUID(uid: string) {
    this.loading$.next(true);
    return this.firestore
      .collection<LiveStream>(LIVE_STREAMINGS, (ref) =>
        ref
          .orderBy("status", "asc")
          .where("status", ">", 0)
          .orderBy("timestamp", "desc")
          .where("uid", "==", uid)
      )
      .get()
      .pipe(
        map((action) => {
          return action.docs.map((a) => {
            return a.data();
          });
        })
      );
  }

  getVideoById(id: string) {
    this.loading$.next(true);
    return this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(id)
      .get()
      .pipe(
        finalize(() => this.loading$.next(false)),
        map((action) => {
          const data = action.data() as LiveStream;
          return { ...data, id: action.id } as LiveStream;
        })
      );
  }

  getLiveProductsByLiveId(liveId: string) {
    return this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(liveId)
      .collection(LIVE_PRODUCTS, (ref) => ref.orderBy("timestamp", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as LiveProduct;
            return { ...data, id: a.payload.doc.id } as LiveProduct;
          });
        })
      );
  }

  getLiveProductById(id: string) {
    return this.http.get<any>(
      "https://europe-west2-furniin-d393f.cloudfunctions.net/getLiveProductById?id=" +
        id
    );
  }

  public getLastStreaming() {
    return this.firestore
      .collection(LIVE_STREAMINGS, (ref) =>
        ref
          .orderBy("status", "asc")
          .where("status", ">", 0)
          .orderBy("timestamp", "desc")
          .limit(1)
      )
      .get();
  }

  public getAllLastMessages(liveId: string) {
    return this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(liveId)
      .collection(live_chats, (ref) => ref.orderBy("timestamp", "desc"))
      .get()
      .pipe(
        map((actions) =>
          actions.docs.map((a) => {
            return {
              ...a.data(),
              id: a.id,
            } as LiveMessage;
          })
        )
      );
  }

  public subscribeToLiveMessages(liveId: string) {
    const collection = this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(liveId)
      .collection(live_chats, (ref) => ref.orderBy("timestamp", "desc"));
    // return collection.auditTrail(["modified"]).pipe(
    return collection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          return {
            ...a.payload.doc.data(),
            id: a.payload.doc.id,
          } as LiveMessage;
        })
      )
    );
  }

  public getFirebaseDocId() {
    return this.firestore.createId();
  }
  public async sendMessage(
    messageText: string,
    liveId: string,
    me: User,
    product = null
  ) {
    const messageId = this.getFirebaseDocId();
    const timestamp = getTimestamp();
    const message: LiveMessage = {
      from: me,
      body: messageText,
      images: [],
      timestamp: timestamp,
      type: 1,
      id: messageId,
      product: product,
    };
    await this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(liveId)
      .collection(live_chats)
      .doc(messageId)
      .set(message, { merge: true });
  }

  public async saveLiveProduct(
    product: LiveProduct,
    me: User,
    continueToLive: boolean,
    sendMessage = true
  ) {
    const batch = this.firestore.firestore.batch();
    if (continueToLive) {
      batch.set(
        this.firestore
          .collection(LIVE_STREAMINGS)
          .doc(product.liveId)
          .collection(LIVE_PRODUCTS)
          .doc(product.id).ref,
        product,
        { merge: true }
      );
      if (sendMessage) {
        await this.sendMessage(
          product.about || "",
          product.liveId,
          me,
          product
        );
      }
    }
    batch.set(
      this.firestore.collection(LIVE_PRODUCTS).doc(product.id).ref,
      product,
      { merge: true }
    );
    await batch.commit();
  }

  public getAllProductByUid(uid: string) {
    return this.firestore
      .collection(LIVE_PRODUCTS, (ref) =>
        ref.orderBy("timestamp", "desc").where("ownerUid", "==", uid)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            return {
              ...data,
              id: a.payload.doc.id,
            } as LiveProduct;
          })
        )
      );
  }

  public async deleteCatalogById(id: string) {
    await this.firestore.collection(LIVE_PRODUCTS).doc(id).delete();
  }
}
