import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Subscription } from "rxjs";
import { first, map } from "rxjs/operators";
import { wallpost } from "src/app/constants";

@Injectable({
  providedIn: "root",
})
export class NewPostService {
  firstWallpostId: BehaviorSubject<string> = new BehaviorSubject(null);
  newWallsubs: Subscription;
  haveNewWallPost: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private firestore: AngularFirestore) {}

  initNewWallPost() {
    this.newWallsubs = this.firestore
      .collection(wallpost, (ref) => ref.orderBy("timestamp", "desc").limit(1))
      .snapshotChanges()
      .pipe(
        map((action) => {
          return action.map((res) => {
            return { id: res.payload.doc.id };
          });
        })
      )
      .subscribe((response) => {
        this.firstWallpostId.pipe(first()).subscribe((firstId) => {
          if (firstId) {
            if (firstId !== response[0].id) {
              this.haveNewWallPost.next(true);
            } else {
              this.haveNewWallPost.next(false);
            }
          }
        });
      });
  }

  onDestroy() {
    this.newWallsubs?.unsubscribe();
  }
}
