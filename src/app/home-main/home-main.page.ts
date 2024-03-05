import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwUpdate } from "@angular/service-worker";
import {
  IonInfiniteScroll,
  MenuController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { BehaviorSubject, Observable, lastValueFrom } from "rxjs";
import { first, map } from "rxjs/operators";
import { DesignerManufacturerAlphabeticallyService } from "src/app/home-designer/designer-manufacturer-alphabetically/designer-manufacturer-alphabetically.service";
import { RecomandedProduct } from "src/app/models/product";
import { PopoverVideo, WallPost, WallPostData } from "src/app/models/wall-test";
import { DatabaseService } from "src/app/services/database.service";
import { convertTime } from "src/app/services/functions/pipe-functions";
import { MenuService } from "src/app/services/menu.service";
import { environment } from "src/environments/environment";
import { AppComponent } from "../app.component";
import { NewPostService } from "../components/menu-items/home-item/new-post.service";
import {
  LIVE_STREAMINGS,
  lazyImage,
  users,
  wallet,
  wallpost,
} from "../constants";
import { SelectiveLoadingStrategy } from "../custom-preload-strategy";
import { User } from "../models/user";
import { WalletData } from "../models/wallet";
import { TermsConditionPage } from "../register/terms-condition/terms-condition.page";
import { LoginService } from "../services/login.service";
import { ScreenService } from "../services/screen.service";
import { SeoService } from "../services/seo.service";
import { WalletService } from "../services/wallet.service";
import { HomeService } from "./home.service";
import { NavigationExtras } from "@angular/router";
import { UtilityService } from "../services/utility.service";
import { getTimestamp } from "../services/functions/functions";

@Component({
  selector: "app-home-main",
  templateUrl: "./home-main.page.html",
  styleUrls: ["./home-main.page.scss"],
})
export class HomeMainPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  isBrowser = AppComponent.isBrowser.value;
  isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  onRegistrationForm: FormGroup;
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  matched: boolean = true;
  isMessenger: boolean = false;
  me: User;
  isDesigner: boolean = false;

  wallet: WalletData;
  wallPostQueryAfter: QueryDocumentSnapshot<WallPostData>;
  isFirstTime: boolean = true;
  wallPosts: WallPost[] = [];
  randomProducts: RecomandedProduct[] = [];

  findCalled = false;
  isPostSaved = false;
  isRecommendSaved = false;

  default = lazyImage;
  screenWidth = 0;
  videoVisible = false;
  popoverVideoIndex: PopoverVideo = { index: 0, isSet: false };
  scrollEnabled: Observable<boolean>;
  reelsVisibility = false;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private storage: LoginService,
    public homeService: HomeService,
    private walletService: WalletService,
    private popoverController: PopoverController,
    private menuService: MenuService,
    private database: DatabaseService,
    private strategy: SelectiveLoadingStrategy,
    private sw: SwUpdate,
    private newwallPostService: NewPostService,
    private nav: NavController,
    private seoService: SeoService,
    public manufacturerService: DesignerManufacturerAlphabeticallyService,
    public screen: ScreenService,
    @Inject(PLATFORM_ID) private platformId: any,
    private menuCtrl: MenuController,
    public newPostService: NewPostService,
    private utilService: UtilityService
  ) {}
  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.seoService.init(
        "Social network/ marketplace",
        "Get the full story from the hottest news and entertainment with all the live commentary and video streaming.",
        "https://storage.googleapis.com/furniin-d393f.appspot.com/files/gootweet.png",
        "gootweet"
      );
    } else {
      this.newPostService.initNewWallPost();
      this.screen.width.subscribe((width) => {
        this.screenWidth = width;
      });
      if (this.screen.width.value > 1200) {
        this.menuService.onMenuBarClick(0);
      }
    }
  }

  public gotoCreateReel() {
    if (this.me) {
      this.nav.navigateForward("/create-reel-record", {
        animated: true,
        animationDirection: "forward",
      });
    } else {
      this.nav.navigateBack("/login", {
        animated: true,
        animationDirection: "back",
      });
    }
  }

  public uploadVideo() {
    this.screen.uploaderModal.next(true);
  }

  public async createLive() {
    await this.utilService.present("Checking live status...");
    await lastValueFrom(
      this.firestore
        .collection(LIVE_STREAMINGS, (ref) =>
          ref
            .where("uid", "==", this.me.uid)
            .where("live", "==", true)
            .orderBy("timestamp", "desc")
            .limit(1)
        )
        .get()
    )
      .then(async (queries) => {
        if (!queries.empty) {
          const liveId = queries.docs[0].id;
          await this.utilService.dismiss();
          this.nav.navigateForward("live-chat/" + liveId + "/2", {
            animated: true,
            animationDirection: "forward",
          });
        } else {
          this.utilService.setLoadingText("Creating live...");
          const liveId = this.firestore.createId();
          console.log("LiveId: ", liveId);

          await this.firestore.collection(LIVE_STREAMINGS).doc(liveId).set({
            id: liveId,
            uid: this.me.uid,
            owner: this.me,
            timestamp: getTimestamp(),
            videoUrl: null,
            status: 0,
            live: false,
          });
          await this.utilService.dismiss();
          this.nav.navigateForward("live-chat/" + liveId + "/1", {
            animated: true,
            animationDirection: "forward",
          });
        }
      })
      .catch(async (err) => {
        console.log(err);
        await this.utilService.dismiss();
      });
  }

  public reload() {
    window.location.reload();
  }

  async ionViewDidEnter() {
    await this.menuCtrl.enable(true, "main-menu");
    if (isPlatformBrowser(this.platformId)) {
      await this.storage.getUser().then(async (user: User) => {
        this.menuService.init(user);
        this.wallPostQueryAfter = null;
        this.getWallPosts(user);
        if (user) {
          this.me = user;
          if (user.rule == "designer") {
            await this.walletService
              .checkWallet(user.uid)
              .then(async (status) => {
                if (!status) {
                  await this.firestore
                    .collection(wallet)
                    .doc(user.uid)
                    .set({ balance: 0, currency: "$" }, { merge: true });
                }
              });

            setTimeout(() => {
              this.strategy.preLoadRoute([
                "designer-manufacturer-alphabetically",
                "post",
                "seller",
                "profile",
                "designer-wallet",
              ]);
            }, 3000);

            this.isDesigner = true;
          } else {
            setTimeout(() => {
              this.strategy.preLoadRoute([
                "post",
                "product",
                "seller",
                "profile",
                "purse",
                "product",
                "gootweet-tube",
                "create-reel-record",
                "reel-view",
                "live-chat",
                "create-live",
                "view-live",
                "live-products",
              ]);
            }, 2000);
          }
          this.userType = user.rule;
          this.userTypeInNumber.next(
            this.userType === "manufacturer" ||
              this.userType === "retailchaincenter"
              ? 1
              : 2
          );

          this.isLoggedin.next(true);

          this.walletService
            .getWalletData(this.me?.uid)
            .pipe(first())
            .subscribe((query) => {
              this.wallet = query.data() as WalletData;
            });

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
                  first_name: data?.full_name?.first_name
                    ? data?.full_name?.first_name
                    : "",
                  last_name: data?.full_name?.last_name
                    ? data?.full_name?.last_name
                    : "",
                };
              }
            });

          // loading messanger for designer only, in right side...
          if (environment.production) {
            this.sw.activateUpdate();
            this.sw.available.pipe(first()).subscribe(() => {
              this.sw.activateUpdate();
              location.reload();
            });
            this.sw.checkForUpdate();
          }
        } else {
          setTimeout(() => {
            this.strategy.preLoadRoute([
              "post",
              "seller",
              "profile",
              "login",
              "register",
            ]);
          }, 3000);
          this.isLoggedin.next(false);
        }
      });
      this.onRegistrationForm = this.formBuilder.group({
        firstName: [null, Validators.compose([Validators.required])],
        lastName: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])],
        confirm_password: [null, Validators.compose([Validators.required])],
        terms: [null, Validators.compose([Validators.required])],
      });
    }
  }

  async openTerms() {
    let data = {
      type: 1,
    };
    const popover = await this.popoverController.create({
      component: TermsConditionPage,
      animated: true,
      backdropDismiss: true,
      componentProps: data,
      cssClass: "api-instructions",
      keyboardClose: true,
      mode: "ios",
    });

    return await popover.present();
  }

  async findNext(event) {
    this.getWallPosts(this.me);
    setTimeout(async () => {
      event.target.complete();
    }, 2000);
  }

  getWallPosts(user: User) {
    if (this.findCalled) {
      return;
    } else {
      this.findCalled = true;
    }
    let collection = this.homeService.getWallpost(this.wallPostQueryAfter);
    collection
      .get()
      .pipe(
        first(),
        map((actions) => {
          if (actions.docs.length > 0) {
            this.wallPostQueryAfter = actions.docs[
              actions.docs.length - 1
            ] as QueryDocumentSnapshot<WallPostData>;
          }
          return actions.docs.map((a, index) => {
            let data: WallPostData = a.data() as WallPostData;
            let id = a.id;
            if (
              index > 1 &&
              !this.popoverVideoIndex.isSet &&
              data?.owner?.rule === "manufacturer"
            ) {
              this.popoverVideoIndex = {
                index: index,
                isSet: true,
              };
            }
            data.convertedTime = convertTime(data.timestamp);
            let wallPost: WallPost = {
              data: data,
              id: id,
              myUid: user?.uid,
              shortened: true,
              comments: null,
              isCommentAll: false,
              commentText: "",
              commentForEdit: null,
              whoTyping: null,
              collection: collection,
              userCollection: this.firestore.collection(users),
            };
            return wallPost;
          });
        })
      )
      .subscribe((data) => {
        if (data.length > 0) {
          if (this.isFirstTime) {
            this.isFirstTime = false;
            this.wallPosts = [];
          }
          this.wallPosts = [...this.wallPosts, ...data];

          if (!this.isPostSaved) {
            this.isPostSaved = true;
            this.database.saveLastLoadedPosts(this.wallPosts);
          }

          if (this.wallPosts.length > 0) {
            this.newwallPostService.firstWallpostId.next(this.wallPosts[0].id);
          }
        }
        this.findCalled = false;
        // The element is visible, do something
      });
    if (this.wallPosts.length == 0) {
      this.loadLastPostsAndAds();
    }
  }
  loadLastPostsAndAds() {
    this.database.getLastLoadedPosts().then((posts) => {
      if (posts && posts.length > 0) {
        this.wallPosts = posts;
      }
    });
    // this.database.getLastAds().then((ads) => {
    //   if (ads && ads.length > 0) {
    //     this.randomProducts = ads;
    //   }
    // });
  }

  actionListener(action) {
    this.firestore
      .collection(wallpost)
      .doc(action.wallPostId)
      .delete()
      .then(() => {
        if (this.wallPosts.length > 0) {
          const p = this.wallPosts.indexOf(
            this.wallPosts.find((wallPost) => wallPost.id == action.wallPostId)
          );
          this.wallPosts.splice(p, 1);
        }
      });
  }

  onAllContacts() {
    let navExtra: NavigationExtras = {
      queryParams: {
        search_query: "",
        isUserSearch: true,
        isProduct: false,
        isAll: true,
      },
    };
    this.nav.navigateForward("search-result", navExtra);
  }

  addPost() {
    if (this.me) this.nav.navigateForward("add-post");
    else this.nav.navigateBack("login");
  }
}
