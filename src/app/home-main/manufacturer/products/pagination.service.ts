import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { map, scan, take } from "rxjs/operators";
import { Product } from "src/app/models/product";

interface QueryConfig {
  path: string; //  path to collection
  uid: string;
  limit: number; // limit per query
}

@Injectable({
  providedIn: "root",
})
export class PaginationService {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  data: Observable<Product[]>;
  loading: Observable<boolean> = this._loading.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  startAfter: QueryDocumentSnapshot<Product>;

  constructor(private firestore: AngularFirestore) {}

  init(path: string, uid: string) {
    this.query = {
      path,
      limit: 20,
      uid: uid,
    };

    const first = this.firestore
      .collection(this.query.path)
      .doc(this.query.uid)
      .collection<Product>(this.query.path, (ref) =>
        ref.orderBy("timestamp", "desc").limit(this.query.limit)
      );

    this.mapAndUpdate(first);
    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return acc.concat(val);
      })
    );
  }

  // Retrieve additional data from firestore
  more() {
    const more = this.firestore
      .collection(this.query.path)
      .doc(this.query.uid)
      .collection<Product>(this.query.path, (ref) =>
        ref
          .orderBy("timestamp", "desc")
          .limit(this.query.limit)
          .startAfter(this.startAfter)
      );
    this.mapAndUpdate(more);
  }

  private mapAndUpdate(col: AngularFirestoreCollection<Product>) {
    if (this._done.value || this._loading.value) {
      return;
    }
    this._loading.next(true);
    return col
      .get()
      .pipe(
        take(1),
        map((actions) =>
          actions.docs.map((a, index) => {
            if (actions.docs.length - 1 == index) {
              this.startAfter = a;
            }
            return { ...a.data(), id: a.id } as Product;
          })
        )
      )
      .subscribe((products) => {
        this._data.next(products);
        this._loading.next(false);
        if (!products.length) {
          this._done.next(true);
        }
      });
  }
}
