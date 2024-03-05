import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Cloudinary } from "@cloudinary/url-gen";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { ModalController, NavController } from "@ionic/angular";
import { REELS_VIDEO } from "src/app/constants";
import { Reel } from "src/app/models/reels.model";
import { User } from "src/app/models/user";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { SwiperOptions } from "swiper";
import { ReelsService } from "../reels.service";
import { CommentsComponent } from "./comments/comments.component";

@Component({
  selector: "app-reel-view",
  templateUrl: "./reel-view.component.html",
  styleUrls: ["./reel-view.component.scss"],
})
export class ReelViewComponent implements OnInit {
  public me: User;
  public more = false;
  config: SwiperOptions = {
    mousewheel: true,
  };
  public videoBase = REELS_VIDEO;
  public reelCurrentId = null;
  public isLiked = false;
  public type = "reels";
  public reels: Reel[] = [];
  private currentIndex: number;
  public muted = false;
  public activePlayer: HTMLVideoElement;
  constructor(
    private screen: ScreenService,
    private loginService: LoginService,
    public reelsService: ReelsService,
    private nav: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  onClose() {
    this.nav.back();
  }

  ionViewWillEnter = () => {
    this.screen.fullScreen.next(true);
    this.screen.headerHide.next(true);
  };
  ionViewWillLeave = () => {
    this.screen.fullScreen.next(false);
    this.screen.headerHide.next(false);
    const videoPlayer = document.getElementsByTagName(
      "video"
    )[0] as HTMLVideoElement;
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.muted = true;
    }
  };

  async ngOnInit() {
    this.me = await this.loginService.getUser();
    this.route.queryParams.subscribe((res) => {
      if (res) {
        this.type = res["type"];
        const ownerUid = res["uid"];
        this.reelsService.selectedIndex = res["index"];
        if (this.type === "reels") {
          if (this.reelsService.reels.length === 0) {
            this.reelsService.getPreferredReels().then(() => {
              this.reels = this.reelsService.reels;
              setTimeout(() => {
                this.playCurrentVideo(this.reelsService.selectedIndex);
              }, 2000);
            });
          } else {
            this.reels = this.reelsService.reels;
            setTimeout(() => {
              this.playCurrentVideo(this.reelsService.selectedIndex);
            }, 2000);
          }
        } else if (this.type === "user-reels") {
          if (this.reelsService.myReels.length === 0) {
            this.reelsService.getPreferredUserReels(ownerUid).then(() => {
              this.reels = this.reelsService.myReels;
              setTimeout(() => {
                this.playCurrentVideo(this.reelsService.selectedIndex);
              }, 2000);
            });
          } else {
            this.reels = this.reelsService.myReels;
            setTimeout(() => {
              this.playCurrentVideo(this.reelsService.selectedIndex);
            }, 2000);
          }
        }
      }
    });
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

  public unmutePlayer(index: number) {
    this.activePlayer = this.getActivePlayer(index);
    if (this.activePlayer) {
      const isMuted = this.activePlayer.muted;
      console.log(isMuted);

      this.activePlayer.muted = !isMuted;
      this.muted = !isMuted;
    }
  }

  public onSwipe(event) {
    const activeIndex = event[0].activeIndex;
    const previousIndex = event[0].previousIndex;
    this.getActivePlayer(previousIndex)?.pause();
    // const container = document.getElementById(
    //   "video-container-" + previousIndex
    // ) as HTMLDivElement;
    // if (container) {
    //   container.innerHTML = "";
    // }
    // const previousPlayer = document.getElementById(
    //   "reel-player-" + previousIndex
    // ) as HTMLVideoElement;
    // if (previousPlayer) {
    //   previousPlayer.currentTime = 0;
    //   previousPlayer.muted = true;
    //   previousPlayer.pause();
    // }
    this.playCurrentVideo(activeIndex);
  }
  async playCurrentVideo(index: number) {
    if (this.reels.length === 0) {
      return;
    }
    this.reelCurrentId = this.reels[index]?.id;
    const publicId = this.reels[index]?.asset.public_id;

    this.currentIndex = index;
    this.getVideoTag(publicId, index) as any;
    this.muted = false;
    this.cdr.detectChanges();
    if (this.me) {
      this.isLiked = await this.reelsService.isLiked(
        this.reelCurrentId,
        this.me.uid
      );
    }
  }

  getActivePlayer(index: number) {
    return (this.activePlayer = document.getElementById(
      "reel-player-" + index
    ) as HTMLVideoElement);
  }

  getVideoTag(publicId: string, index: number) {
    this.getActivePlayer(index).src = this.transform(publicId);
    // return `<vg-player><vg-overlay-play></vg-overlay-play><video id="reel-player-${index}" loop style="height:100%;width:100%" autoplay  playsinline preload  oncontextmenu="return false;">
    //       <source src="${this.transform(publicId)}" >
    //    </video></vg-player>`;
  }
  transform(publicId: string): any {
    return new Cloudinary({ cloud: { cloudName: "ddvayajgr" } })
      .video(publicId)
      .delivery(quality(40))
      .toURL();
  }

  public async openComments() {
    if (this.me) {
      const modal = await this.modalController.create({
        component: CommentsComponent,
        componentProps: {
          me: this.me,
          reelId: this.reelCurrentId,
          index: this.currentIndex,
        },
        animated: true,
        mode: "ios",
        backdropDismiss: true,
        cssClass: "reel-comments",
        keyboardClose: true,
      });
      await modal.present();
    } else {
      this.nav.navigateRoot("/login", {
        animated: true,
        animationDirection: "back",
      });
    }
  }

  public onLiked() {
    if (this.me) {
      if (this.isLiked) {
        this.reels[this.currentIndex].likeCount--;
        this.reelsService.removeLike(this.reelCurrentId, this.me);
      } else {
        this.reels[this.currentIndex].likeCount++;
        this.reelsService.sendLike(this.reelCurrentId, this.me);
      }
      this.isLiked = !this.isLiked;
    } else {
      this.nav.navigateRoot("/login", {
        animated: true,
        animationDirection: "back",
      });
    }
  }
}
