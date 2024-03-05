import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  LIVE_STREAMINGS_PRODUCT_PHOTO_BASE,
  LIVE_STREAMING_VIDEOS_BASE,
} from "src/app/constants";
import { LiveProduct } from "src/app/models/product";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-live-products-page",
  templateUrl: "./live-products.page.html",
  styleUrls: ["./live-products.page.scss"],
})
export class LiveProductsPage implements OnInit {
  public me: User;
  public liveVideo: LiveStream;
  public liveProducts: LiveProduct[];
  public videoBase = LIVE_STREAMING_VIDEOS_BASE;
  public selectedTab = new BehaviorSubject(2);
  public height = 0;
  private destroy$ = new Subject<boolean>();
  public allProducts: LiveProduct[] = [];
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;
  public isPortrait = false;
  public selectedProduct: LiveProduct = null;
  public contextMenuVisible = false;
  constructor(
    private nav: NavController,
    private screen: ScreenService,
    private streamingService: LiveStreamingService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private utils: UtilityService
  ) {}
  ionViewWillEnter() {
    this.screen.fullScreen.next(true);
  }

  ionViewWillLeave() {
    this.screen.fullScreen.next(false);
    this.selectedProduct = null;
  }

  @HostListener("window:orientationchange")
  onOrientationChange() {
    this.isPortrait = window.matchMedia("(orientation: portrait)").matches;
  }

  async ngOnInit() {
    this.me = await this.loginService.getUser();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(async (res) => {
      if (res.id) {
        this.screen.height.subscribe((value) => {
          this.height = value - 65;
        });
        this.streamingService
          .getVideoById(res.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((videoRes) => {
            if (videoRes) {
              this.liveVideo = videoRes;
              this.contextMenuVisible = this.liveVideo.uid === this.me.uid;
            }
          });
        this.streamingService
          .getLiveProductsByLiveId(res.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((products) => {
            if (products) {
              this.liveProducts = products;
            }
          });
        // await lastValueFrom(
        //   this.streamingService
        //     .getAllLastMessages(res.id)
        //     .pipe(takeUntil(this.destroy$))
        // ).then((messages) => {
        //   console.log("old message receive");

        //   this.messages = messages;
        //   this.messages.shift();
        // });
      }
    });
  }

  gotoNext(url: string) {
    this.nav.navigateForward(url, {
      animated: true,
      animationDirection: "forward",
    });
  }

  onSegmentChange(event) {
    if (event.detail.value === "1") {
      this.streamingService
        .getAllProductByUid(this.liveVideo.owner.uid)
        .subscribe((data) => {
          this.allProducts = data;
        });
    }
  }

  onProductEdit(product: LiveProduct) {
    this.selectedProduct = product;
  }
}
