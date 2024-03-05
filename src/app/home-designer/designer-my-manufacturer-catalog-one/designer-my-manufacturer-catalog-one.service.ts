import { Injectable, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";
import { User, UserForRequestCheck } from "../../models/user";
import { getUser } from "../../services/functions/functions";

@Injectable({
  providedIn: "root",
})
export class DesignerMyManufacturerCatalogOneService implements OnDestroy {
  private paginationSub: Subscription;
  private nextQueryAfter: QueryDocumentSnapshot<User>;
  private findSub: Subscription;
  loading = false;

  manufacturers: UserForRequestCheck[] = [];
  loggedInDesigner;
  constructor(private firestore: AngularFirestore) {
    getUser().then((user) => {
      this.loggedInDesigner = user;
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  isFindCalled = false;
  find() {
    if (this.isFindCalled) {
      return;
    }

    this.isFindCalled = true;

    try {
      let collection: AngularFirestoreCollection<User> =
        this.getCollectionQuery();

      this.unsubscribe();

      this.query(collection);
    } catch (err) {
      throw err;
    }
  }

  private getCollectionQuery(): AngularFirestoreCollection<User> {
    if (this.nextQueryAfter) {
      return this.firestore.collection<User>("users", (ref) =>
        ref.where("rule", "==", "manufacturer").startAfter(this.nextQueryAfter)
      );
    } else {
      return this.firestore.collection<User>("users", (ref) =>
        ref.where("rule", "==", "manufacturer")
      );
    }
  }

  private unsubscribe() {
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }
    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  private query(collection: AngularFirestoreCollection<User>) {
    try {
      this.findSub = collection.snapshotChanges().subscribe((query) => {
        this.manufacturers = [];
        query.forEach((item) => {
          let data: UserForRequestCheck =
            item.payload.doc.data() as UserForRequestCheck;
          data.collRef = item.payload.doc.ref;
          data.uid = item.payload.doc.id;
          this.manufacturers.push(data);
        });
        this.loading = false;
      });
    } catch (e) {
      console.log(e);
    }
  }
}
