import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { IonInfiniteScroll } from "@ionic/angular";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { users } from "../../constants";
import { Follow } from "../../models/follow";
import { User } from "../../models/user";
import { WallPost } from "../../models/wall";
import { WalletData } from "../../models/wallet";
import { WalletService } from "../../services/wallet.service";
import { FollowService } from "./follow.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-tracking-manufacturers",
  templateUrl: "./tracking-manufacturers.page.html",
  styleUrls: ["./tracking-manufacturers.page.scss"],
})
export class TrackingManufacturersPage implements OnInit {
  userType: any;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  follows: Follow[];
  me: User;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);

  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  loaded = false;

  items: Observable<WallPost[]>;
  private lastPageReachedSub: Subscription;
  wallet: WalletData;

  isViewAllTrackedManufacturer: boolean = false;
  follorSubs: Subscription;
  followedUserSubs: Subscription;
  constructor(
    public service: FollowService,
    private walletService: WalletService,
    private firestore: AngularFirestore,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      if (user) {
        this.userType = user.rule;
        this.userTypeInNumber.next(
          this.userType === "manufacturer" ||
            this.userType === "retailchaincenter"
            ? 1
            : 2
        );
        this.isLoggedIn.next(true);
        this.me = user;
        this.getFollowList(user.uid);
        this.walletService
          .getWalletData(this.me?.uid)
          .pipe(first())
          .subscribe((query) => {
            this.wallet = query.data() as WalletData;
            this.firestore
              .collection(users)
              .doc(user.uid)
              .get()
              .pipe(first())
              .subscribe((query) => {
                if (query) {
                  let data: any = query.data();
                  if (user.rule !== "user") {
                    this.me.address = data?.details?.address;
                    this.me.profile_photo = data?.profile_photo;
                  }
                  this.me.full_name = {
                    first_name: data?.full_name?.first_name,
                    last_name: data?.full_name?.last_name,
                  };
                }
              });
          });
      } else {
        this.isLoggedIn.next(false);
      }
    });
  }

  getFollowList(uid: string) {
    this.follorSubs = this.service.getFollowed(uid).subscribe((query1) => {
      this.follows = [];
      query1.forEach((item) => {
        const id = item.payload.doc.id;
        const data1 = item.payload.doc.data();
        this.followedUserSubs = this.service
          .getFollowedUserData(data1.uid)
          .subscribe((query2) => {
            const data2: any = query2.payload.data();
            this.follows.push({
              id: id,
              image: data2?.profile_photo,
              name:
                data2?.full_name?.first_name +
                " " +
                data2?.full_name?.last_name,
              uid: data2?.uid,
              timestamp: data1?.timestamp,
            });
          });
      });
      this.service.find(this.follows, this.me.uid);
    });
  }
  removeFollows(followId: string, i: number) {
    this.follows.splice(i, 1);
    this.service.removeFollows(this.me.uid, followId).then(() => {});
  }

  async findNext(event) {
    this.service.find(this.follows, this.me.uid);
    setTimeout(async () => {
      event.target.complete();
    }, 100);
  }
  ngOnDestroy(): void {
    if (this.lastPageReachedSub) {
      this.lastPageReachedSub.unsubscribe();
    }
    if (this.follorSubs) {
      this.follorSubs.unsubscribe();
    }
    if (this.followedUserSubs) {
      this.followedUserSubs.unsubscribe();
    }
  }
}
