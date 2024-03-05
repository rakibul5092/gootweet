import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first } from "rxjs/operators";
import { commissions, requests } from "src/app/constants";
import { UserForRequestCheck } from "src/app/models/user";

@Component({
  selector: "app-manufacturer",
  templateUrl: "./manufacturer.component.html",
  styleUrls: ["./manufacturer.component.scss"],
})
export class ManufacturerComponent implements OnInit {
  @Input() manufacturer: UserForRequestCheck;
  @Output() gotoProfileEvent: EventEmitter<UserForRequestCheck> =
    new EventEmitter();
  @Output() onRequestEvent: EventEmitter<string> = new EventEmitter();
  @Input() myUid: string;
  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore
      .collection(commissions)
      .doc(this.manufacturer.uid)
      .get()
      .pipe(first())
      .subscribe((comm) => {
        let commission: any = comm.data();
        if (commission) {
          this.manufacturer.averageCommission = commission.averageCommission;
        }
      });

    this.manufacturer.collRef
      .collection(requests)
      .doc(this.myUid)
      .get()
      .then((req) => {
        const r = req.data();
        if (r) {
          if (r.designer_uid === this.myUid) {
            this.manufacturer.isRequested = true;
          } else {
            this.manufacturer.isRequested = false;
          }
        }
      });
  }
  gotoProfile(manufacturer: UserForRequestCheck) {
    this.gotoProfileEvent.emit(manufacturer);
  }

  askRequest(uid: string) {
    this.onRequestEvent.emit(uid);
  }
}
