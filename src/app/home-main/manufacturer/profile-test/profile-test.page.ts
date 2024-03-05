import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { Title, TransferState, makeStateKey } from "@angular/platform-browser";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {
  IonInfiniteScroll,
  ModalController,
  NavController,
} from "@ionic/angular";
import algoliaserch from "algoliasearch";
import { base64ToFile } from "ngx-image-cropper";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { ProductFilterService } from "src/app/components/home-page/sub-category/product-filter.service";
import { ManufacturerInfoComponent } from "src/app/components/manufacturer-info/manufacturer-info.component";
import { PostService } from "src/app/components/post/post.service";
import { WallPost, WallPostData } from "src/app/models/wall-test";
import { NamePipe } from "src/app/pipes/name.pipe";
import { DatabaseService } from "src/app/services/database.service";
import { openPhoto } from "src/app/services/functions/functions";
import { SeoService } from "src/app/services/seo.service";
import { environment } from "../../../../environments/environment";
import { ChatService } from "../../../chat/chat-designer/chat.service";
import { SendDesignerMessengerPage } from "../../../chat/send-designer-messenger/send-designer-messenger.page";
import { NAVIGATION_TYPE, users, wallpost } from "../../../constants";
import { DesignerManufacturerAlphabeticallyService } from "../../../home-designer/designer-manufacturer-alphabetically/designer-manufacturer-alphabetically.service";
import { Product, RecomandedProduct } from "../../../models/product";
import { Designer, User } from "../../../models/user";
import { WalletData } from "../../../models/wallet";
import { AwsUploadService } from "../../../services/aws-upload.service";
import { GotoProfileService } from "../../../services/goto-profile.service";
import { LoginService } from "../../../services/login.service";
import { OpenSingleProductService } from "../../../services/open-single-product.service";
import { ScreenService } from "../../../services/screen.service";
import { UtilityService } from "../../../services/utility.service";
import { WalletService } from "../../../services/wallet.service";
import { AdvanceSearchService } from "../../advance-search/advance-search.service";
import { SendMessageService } from "./../profile-test/send-message.service";
import { ProfileService } from "./profile.service";

@Component({
  selector: "app-profile-test",
  templateUrl: "./profile-test.page.html",
  styleUrls: ["./profile-test.page.scss"],
})
export class ProfileTestPage implements OnInit {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  @Output() activePageCheckEvent: EventEmitter<string> = new EventEmitter();
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userType: string;
  userTypeInNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  me: User;
  ownerUid: string;

  activeType = "wall";

  wallet: WalletData;

  productOwner: any;

  searchText = "";
  client: any;
  index: any;
  searchConfig = {
    ...environment.algolia,
    indexName: "products_title",
  };
  showResult = false;
  searchResult = [];
  page = 0;
  searchResponse;
  nodata = false;

  searchType;
  event: IonInfiniteScroll;
  catText;
  titleText;

  isMyProfile: boolean = false;
  isDesignerLoggedIn: boolean = false;
  isDesignerProfile: boolean = false;

  isNormalUser: boolean = false;

  header: any;
  leftBar: any;
  rightBar: any;

  randomProducts: RecomandedProduct[] = [];
  wallPostQueryAfter: QueryDocumentSnapshot<WallPostData>;
  isFirstTime: boolean = false;
  wallPosts: WallPost[] = [];
  findCalled = false;
  isPostSaved = false;
  isRecommendSaved = false;
  noPost = false;

  connectedDesigners: User[] = [];
  screenWidth = 0;
  name = "";
  profileImageEvent: any;
  profileImageModal = false;
  openPhoto = openPhoto;
  constructor(
    private storage: LoginService,
    public profileService: ProfileService,
    private navController: NavController,
    public util: UtilityService,
    private screen: ScreenService,
    private firestore: AngularFirestore,
    private walletService: WalletService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchPopupService: AdvanceSearchService,
    private modalController: ModalController,
    private awsUpload: AwsUploadService,
    private titleService: Title,
    private openSingleProductService: OpenSingleProductService,
    private gotoProfileService: GotoProfileService,
    private database: DatabaseService,
    private designerChat: ChatService,
    private designerManufacturerAlphabeticallyService: DesignerManufacturerAlphabeticallyService,
    public sendMessageService: SendMessageService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: any,
    private ts: TransferState,
    private http: HttpClient,
    private namePipe: NamePipe,
    private productFilterService: ProductFilterService,
    private postService: PostService
  ) {}
  openMessage() {
    this.sendMessageService.sendMessage(this.me, this.productOwner);
  }

  ionViewWillLeave() {
    this.screen.player.value?.pause();
    this.screen.playerIndex = 0;
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.screen.width.subscribe((width) => {
        this.screenWidth = width;
      });
    }
    this.profileService.manufacturer = null;
    this.activatedRoute.paramMap
      .pipe(first())
      .subscribe((paramMap: ParamMap) => {
        if (paramMap && paramMap.get("uid")) {
          this.ownerUid = paramMap.get("uid");
          const DATAKEY = makeStateKey("user_profile_data_" + this.ownerUid);
          if (isPlatformBrowser(this.platformId)) {
            this.storage.getUser().then((user: User) => {
              if (user) {
                this.me = user;
                this.userType = user.rule;
                this.userTypeInNumber.next(
                  this.userType === "manufacturer" ||
                    this.userType === "designer"
                    ? 1
                    : 2
                );
                this.isMyProfile = this.ownerUid == this.me.uid;
                this.isDesignerLoggedIn = this.userType == "designer";
                this.profileCheckEvent.emit(this.isMyProfile);
                if (!this.isDesignerLoggedIn && !this.isDesignerProfile) {
                  this.setWalletData();
                  if (this.isMyProfile) this.setConnectedDesigner(this.me.uid);
                }
                this.isLoggedIn.next(true);
                this.client = algoliaserch(
                  this.searchConfig.appId,
                  this.searchConfig.apiKey
                );
                this.index = this.client.initIndex(this.searchConfig.indexName);
              } else {
                this.isLoggedIn.next(false);
                this.client = algoliaserch(
                  this.searchConfig.appId,
                  this.searchConfig.apiKey
                );
                this.index = this.client.initIndex(this.searchConfig.indexName);
              }
              this.util.checkIsFollowed(this.me?.uid, this.ownerUid);
            });
            if (!this.ts.hasKey(DATAKEY)) {
              this.getProfileDoc(this.ownerUid).subscribe((query: any) => {
                this.productOwner = query.data() as Designer;
                this.name = this.namePipe.transform(
                  this.productOwner?.full_name
                );
                this.seoService.init(
                  this.name + " | GooTweet",
                  "",
                  this.productOwner?.profile_photo,
                  "profile"
                );

                this.isDesignerProfile = this.productOwner.rule == "designer";
                this.isNormalUser =
                  this.productOwner.rule == "user" ||
                  this.productOwner.rule == "";
              });
            } else {
              this.productOwner = this.ts.get(DATAKEY, null) as any;
              this.seoService.init(
                this.productOwner.name + " | GooTweet",
                "",
                this.productOwner?.profile_photo,
                "profile"
              );

              this.isDesignerProfile = this.productOwner.rule == "designer";
              this.isNormalUser =
                this.productOwner.rule == "user" ||
                this.productOwner.rule == "";
            }
            this.searchPopupService.getCategories(this.ownerUid);
            this.profileService?.wallPosts?.splice(
              0,
              this.profileService?.wallPosts?.length
            );
            this.profileService.nextQueryAfter = null;
            this.profileService.findCalled = false;
            this.getWallPosts(this.ownerUid);
            if (this.router.url.endsWith("/catalog")) {
              this.activeType = "catalog";
            } else if (this.router.url.endsWith("/reels")) {
              this.activeType = "reels";
            } else if (this.router.url.endsWith("/lives")) {
              this.activeType = "lives";
            }
          } else {
            this.getProfileDoc(this.ownerUid, true).subscribe((query: any) => {
              if (query && query.status) {
                this.productOwner = query.data as Designer;
                this.ts.set(DATAKEY, this.productOwner as any);
                this.isDesignerProfile = this.productOwner.rule == "designer";
                this.isNormalUser =
                  this.productOwner.rule == "user" ||
                  this.productOwner.rule == "";
                this.seoService.init(
                  query.data.name + " | GooTweet",
                  "",
                  this.productOwner?.profile_photo,
                  "profile"
                );
              }
            });
          }
        } else {
          this.navController.navigateRoot("/");
        }
      });
    if (this.leftBar && this.rightBar) {
      this.leftBar?.classList?.remove("sticky-bar-left");
      this.rightBar?.classList?.remove("sticky-bar-right");
    }
  }

  getProfileDoc(ownerUid: string, isHttp = false) {
    if (isHttp)
      return this.http.get(
        "https://europe-west2-furniin-d393f.cloudfunctions.net/profile_seo_data?uid=" +
          ownerUid
      );
    else
      return this.firestore.collection(users).doc(ownerUid).get().pipe(first());
  }

  setWalletData() {
    this.walletService
      .getWalletData(this.me.uid)
      .pipe(first())
      .subscribe((query) => (this.wallet = query.data() as WalletData));
  }

  setRandomProducts() {
    this.postService
      .getRandomProducts()
      .pipe(first())
      .subscribe((res: any) => {
        if (res.status) this.randomProducts = res.data;
      });
  }

  async findNext(event) {
    setTimeout(async () => {
      if (this.ownerUid && this.activeType == "wall") {
        this.getWallPosts(this.ownerUid);
      }
      if (this.ownerUid && this.activeType == "catalog") {
        if (this.productFilterService.searching) {
          this.productFilterService.page++;
          this.productFilterService.onFilter(this.productFilterService.page);
        } else {
          this.profileService.findProduct(
            this.ownerUid,
            this.screen.width.value <= 500
          );
        }
      }
      setTimeout(() => {
        event?.target?.complete();
      }, 500);
    }, 200);
  }

  async openInfoModal() {
    const data = { owner: this.productOwner };
    const modal = await this.modalController.create({
      component: ManufacturerInfoComponent,
      componentProps: data,
      animated: true,
      mode: "ios",
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  changeType(type) {
    this.activeType = type;
    if (type === "catalog") {
      this.profileService.products = [];
      this.showResult = false;
      this.profileService.startAfter = null;

      this.router.navigate([
        "profile",
        this.name || "products",
        this.ownerUid,
        "catalog",
      ]);
    } else if (type === "reels") {
      this.router.navigate([
        "profile",
        this.name || "my-reels",
        this.ownerUid,
        "reels",
      ]);
    } else if (type === "lives") {
      this.router.navigate([
        "profile",
        this.name || "my-lives",
        this.ownerUid,
        "lives",
      ]);
    } else {
      this.router.navigate(["profile", this.name, this.ownerUid]);
    }
  }

  ngOnDestroy(): void {
    this.profileService.destroy();
    this.titleService.setTitle("Soc - marketplace | Gootweet");
  }

  openSingleProduct({ uid, id }) {
    this.util.present("Užkraunami produktai").then(() => {
      this.profileService
        .getSingleProduct(uid, id)
        .get()
        .pipe(first())
        .subscribe((query) => {
          if (query) {
            this.util.dismiss().then(() => {
              let pro: Product = query.data() as Product;
              pro.id = query.id;
              this.openSingleProductService.openSingleProduct(
                pro,
                this.productOwner
              );
            });
          }
        });
    });

    this.showResult = false;
  }

  async openProduct(product: RecomandedProduct) {
    this.openSingleProductService.openSingleProduct(
      product.product,
      product.owner
    );
  }

  async openSearchModal() {}

  clearText() {
    this.searchText = "";
    this.showResult = false;
    this.changeType("catalog");
  }

  onBrowseProfileImage(event: any) {
    this.profileImageEvent = event;
    this.profileImageModal = true;
    this.imageType = 1;
  }
  croppedImage: any;
  file: any;
  imageType = 1;
  onCropped(event) {
    this.croppedImage = event.base64;
    this.file = base64ToFile(event.base64);
  }

  async onProfileImageCropped() {
    (<HTMLInputElement>document.getElementById("profile-photo-1212")).value =
      "";
    this.profileImageModal = false;
    this.profileImageEvent.target.value = "";
    if (this.croppedImage && this.file) {
      await this.storage.present("Išsaugoma...");
      let imageData = this.croppedImage;
      let image = {
        base64String: imageData,
        file: this.file,
        format: "webp",
      };
      const name = this.makeName("webp", this.me?.uid);
      await this.awsUpload
        .uploadImage(
          this.imageType === 1 ? "brand_logos" : "cover_photos",
          name,
          image.base64String
        )
        .then(async (res: any) => {
          let nameTimeStamp = name + "?" + Date.now();
          if (this.imageType === 1) {
            this.productOwner.profile_photo = nameTimeStamp;
            this.me.profile_photo = nameTimeStamp;
          } else {
            this.productOwner.cover_photo = nameTimeStamp;
            this.me.cover_photo = nameTimeStamp;
          }
          this.storage.saveUser(this.me);
          await this.firestore
            .collection(users)
            .doc(this.me?.uid)
            .set(
              this.imageType === 1
                ? { profile_photo: nameTimeStamp }
                : { cover_photo: nameTimeStamp },
              { merge: true }
            );

          this.profileImageEvent = null;
          this.file = null;
          this.croppedImage = null;
          await this.storage.dismiss();
        })
        .catch(async (err) => {
          this.profileImageEvent = null;
          this.file = null;
          this.croppedImage = null;
          await this.storage.dismiss();
        });
    }
  }
  close() {
    this.profileImageModal = false;
    this.file = null;
    this.croppedImage = null;
    if (this.profileImageEvent) this.profileImageEvent.target.value = "";
  }

  makeName(mimeType: string, uid: any): string {
    return uid + "." + mimeType;
  }

  onBrowseCoverPhoto(event) {
    this.imageType = 2;
    this.profileImageEvent = event;
    this.profileImageModal = true;
  }

  setConnectedDesigner(uid) {
    if (this.connectedDesigners.length == 0) {
      this.util
        .getAllConnectedDesigners(uid)
        .pipe(first())
        .subscribe((res) => {
          if (res.status) {
            this.connectedDesigners = res.data;
          }
        });
    }
  }

  gotoConnectedPage() {
    this.activePageCheckEvent.emit("connected-designer");
    this.navController.navigateForward("profile/connected-designer");
  }

  getWallPosts(myUid) {
    let collection = this.profileService.getWallpost(
      this.wallPostQueryAfter,
      myUid
    );
    collection
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query && query.docs.length > 0) {
          this.noPost = false;
          if (this.isFirstTime) {
            this.isFirstTime = false;
            this.wallPosts = [];
          }
          this.wallPostQueryAfter = query.docs[
            query.docs.length - 1
          ] as QueryDocumentSnapshot<WallPostData>;

          query.forEach((item) => {
            let id = item.id;
            let data: WallPostData = item.data() as WallPostData;
            this.wallPosts.push({
              data: data,
              id: id,
              myUid: this.me?.uid,
              shortened: true,
              comments: null,
              isCommentAll: false,
              commentText: "",
              commentForEdit: null,
              whoTyping: null,
              collection: collection,
              userCollection: this.firestore.collection(users),
            });
          });
          if (!this.isPostSaved) {
            this.isPostSaved = true;
            this.database.saveLastLoadedPosts(this.wallPosts);
          }

          if (
            !this.isMyProfile &&
            !this.isDesignerProfile &&
            !this.isDesignerLoggedIn
          )
            this.setRandomProducts();
        } else if (this.wallPosts.length == 0) {
          this.noPost = true;
        }
        this.findCalled = false;
      });
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

  prepareForMessenger({ pId }) {
    this.util.present("").then(() => {
      this.firestore
        .collection("products")
        .doc(this.productOwner.uid)
        .collection("products")
        .doc(pId)
        .get()
        .pipe(first())
        .subscribe((pquery) => {
          this.util.dismiss().then(() => {
            let prod: Product = pquery.data() as Product;
            prod.id = pquery.id;
            prod.delivery_time = "";
            this.sendToMessenger(prod);
          });
        });
    });
  }

  async sendToMessenger(product: any) {
    if (product) {
      if (this.isDesignerLoggedIn) {
        this.designerChat.selectedProduct = {
          data: product,
          id: product.id,
          owner: this.productOwner,
        };
      }
      if (this.screen.width.value > 767) {
        this.util.showToast("Pasidalinti į žinutę", "success");
      } else {
        let component = SendDesignerMessengerPage;
        await this.util.openContactsModal(component, false);
      }
    }
  }
  navigate(url: string, type: string) {
    if (type == NAVIGATION_TYPE.ROOT) this.navController.navigateRoot(url);
    else if (type == NAVIGATION_TYPE.FORWARD)
      this.navController.navigateForward(url);
  }

  addPost() {
    if (this.isMyProfile && (this.isDesignerLoggedIn || this.isNormalUser))
      this.navController.navigateForward(
        "/designer/designer-advertisement-two"
      );
    else this.navController.navigateForward("add-post");
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  onDesignerNavigation(type: string) {
    this.activeType = type;
    if (type == "designer-info")
      this.designerManufacturerAlphabeticallyService.find(
        this.productOwner.uid
      );
    else if (type == "portfolio")
      this.profileService.findPortfolio(this.ownerUid);
  }

  openSharePopup() {
    // this.title.setTitle(this.wallPost.data.title);
    let profileUrl = "https://gootweet.com" + this.router.url;
    let data = {
      url: profileUrl,
    };
    this.util.openSharePopup(data);
  }
}
