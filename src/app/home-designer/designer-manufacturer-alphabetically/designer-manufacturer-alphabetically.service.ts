import { Injectable, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { connections, users } from "../../constants";
import {
  Connection,
  ConnectionManufacturerData,
  UserInfo,
} from "../../models/connection";
import { User } from "../../models/user";

@Injectable({
  providedIn: "root",
})
export class DesignerManufacturerAlphabeticallyService implements OnDestroy {
  private nextQueryAfter: QueryDocumentSnapshot<ConnectionManufacturerData>;
  private findSub: Subscription;

  items: Connection[] = [];
  isCalled: boolean = false;

  constructor(private firestore: AngularFirestore) {}
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  find(myUid) {
    if (this.isCalled) {
      return;
    }
    this.isCalled = true;
    try {
      let collection: AngularFirestoreCollection<any> =
        this.getCollectionQuery(myUid);

      this.unsubscribe();
      this.query(collection, myUid);
    } catch (err) {
      throw err;
    }
  }

  private getCollectionQuery(myUid: string): AngularFirestoreCollection<User> {
    if (this.nextQueryAfter) {
      return this.firestore
        .collection<User>("users")
        .doc(myUid)
        .collection(connections, (ref) =>
          ref.limit(20).startAfter(this.nextQueryAfter)
        );
    } else {
      return this.firestore
        .collection<User>("users")
        .doc(myUid)
        .collection(connections, (ref) => ref.limit(20));
    }
  }

  private unsubscribe() {
    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  private query(
    collection: AngularFirestoreCollection<ConnectionManufacturerData>,
    myUid: string
  ) {
    try {
      this.findSub = collection.snapshotChanges().subscribe((query) => {
        // if (query.docs && query.docs.length > 0) {
        //   this.nextQueryAfter = query.docs[
        //     query.docs.length - 1
        //   ] as QueryDocumentSnapshot<ConnectionManufacturerData>;
        // }

        query.forEach((item) => {
          let data: ConnectionManufacturerData =
            item.payload.doc.data() as ConnectionManufacturerData;
          const id = item.payload.doc.id;
          this.firestore
            .collection(users)
            .doc(data?.manufacturer_uid)
            .get()
            .pipe(first())
            .subscribe((userQuery) => {
              let userData: any = userQuery.data();
              let info: UserInfo = {
                full_name: {
                  first_name: userData?.full_name?.first_name,
                  last_name: userData?.full_name?.last_name,
                },
                profile_image: userData?.profile_photo,
                rule: userData?.rule,
                uid: userData?.uid,
              };
              if (info.full_name.first_name) {
                this.items.push({
                  connectionData: data,
                  id: id,
                  manufacturerInfo: info,
                });
              }

              // this.isCalled = false;
            });
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
}
