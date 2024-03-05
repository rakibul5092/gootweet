import {
  AfterViewInit,
  Directive,
  HostListener,
  Input,
  ViewChild,
} from "@angular/core";
import { IonContent, ModalController } from "@ionic/angular";
import { AppComponent } from "../app.component";
import { PopoverVideoComponent } from "../components/popover-video/popover-video.component";
import { ScrollService } from "../components/scroll-up/scroll.service";
import { ChangeOnscrollService } from "../services/change-onscroll.service";
import { ScreenService } from "../services/screen.service";

@Directive({
  selector: "[appHideHeader]",
})
export class HideHeaderDirective implements AfterViewInit {
  @Input() body: IonContent;

  private sliderBody: any;
  private routerOutlet: any;
  private leftBar: HTMLElement;
  private rightBar: HTMLElement;
  private lastX = 0;
  private tabs: HTMLElement = null;
  private ionHeader = null;
  private defaultHeight = "";

  constructor(
    private screen: ScreenService,
    private changeOnScrollService: ChangeOnscrollService,
    private scrollService: ScrollService
  ) {}
  ngAfterViewInit(): void {
    this.initData();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    AppComponent.isBrowser.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.leftBar = document.getElementById("leftBar");
          this.rightBar = document.getElementById("rightBar");
          this.routerOutlet = document.getElementById("nested-router");
          if (this.leftBar && this.rightBar) {
            this.leftBar?.classList?.remove("sticky-bar-left");
            this.rightBar?.classList?.remove("sticky-bar-right");
          }
          if (this.screen.width.value < 768) {
            this.tabs = document.getElementById("tabs");
            this.ionHeader = document.getElementById("ionHeader");
            this.routerOutlet.classList.add("mobile-header-padding");
          }
          this.defaultHeight = document.body.style.height;
        }, 200);
      }
    });
  }

  @HostListener("ionScroll", ["$event"])
  onContentScroll(event: any) {
    this.initScroll(event);
  }

  initScroll(event) {
    const reelContainer = document.getElementsByClassName(
      "reels-container-autoplay"
    );
    if (
      reelContainer &&
      reelContainer.length > this.screen.reelsContainerIndex
    ) {
      const reelPlayer = reelContainer[
        this.screen.reelsContainerIndex
      ].getElementsByTagName("video")[0] as HTMLVideoElement;

      if (reelPlayer) {
        const rect = reelPlayer.getBoundingClientRect();

        if (rect.x !== 0 && rect.y !== 0) {
          if (rect.top > -100 && rect.top < this.screen.height.value - 100) {
            reelPlayer.muted = true;
            reelPlayer.play();
          } else if (
            rect.top > this.screen.height.value - 100 &&
            this.screen.reelsContainerIndex > 0
          ) {
            reelPlayer.pause();
            this.screen.reelsContainerIndex--;
          } else if (rect.top < -100) {
            reelPlayer.pause();
            this.screen.reelsContainerIndex++;
          } else {
            reelPlayer.pause();
          }
        }
      }
    }

    let player =
      document.getElementById("post-container")?.getElementsByTagName("video")[
        this.screen.playerIndex
      ] || null;
    if (player) {
      let react = player.getBoundingClientRect();

      if (react.x != 0 && react.y != 0) {
        if (react.top > -100 && react.top < this.screen.height.value - 100) {
          player.muted = true;
          player.play();
          this.screen.player.next(player);
        } else if (
          react.top > this.screen.height.value - 100 &&
          this.screen.playerIndex > 0
        ) {
          player.pause();
          this.screen.playerIndex--;
        } else if (react.top < -100) {
          player.pause();
          this.screen.playerIndex++;
        } else {
          player.pause();
        }
      }
    } else {
      this.screen.playerIndex--;
    }
    if (this.screen.width.value > 768) {
      if (event.detail.scrollTop > 80) {
        this.scrollService.content = this.body;
        this.changeOnScrollService.changeCategoryDesign.next(true);
      } else {
        this.scrollService.content = null;
        this.changeOnScrollService.changeCategoryDesign.next(false);
      }
    }
    if (this.screen.width.value > 1150) {
      this.sliderBody = document.getElementById("sliderBody");
      this.leftBar = document.getElementById("leftBar");
      this.rightBar = document.getElementById("rightBar");
      let sliderOffset = this.sliderBody?.offsetTop;

      if (event.detail.scrollTop > sliderOffset) {
        this.changeOnScrollService.scrolledBottom.next(true);
        this.rightBar?.classList?.add("sticky-bar-right");
        this.leftBar?.classList?.add("sticky-bar-left");
      } else {
        this.changeOnScrollService.scrolledBottom.next(false);
        this.rightBar?.classList?.remove("sticky-bar-right");
        this.leftBar?.classList?.remove("sticky-bar-left");
      }
    } else if (this.screen.width.value < 1100) {
      this.startAutoHide(event);
    } else {
      if (this.rightBar) {
        this.rightBar?.classList?.remove("sticky-bar-right");
      }
    }
  }

  async startAutoHide(event) {
    let scrollTop = event.detail.scrollTop;
    this.tabs.style.transition = "all 0.3s ease-in-out;";

    if (this.lastX < scrollTop) {
      this.openFullscreen();
      this.screen.searchHide.next(true);
      this.ionHeader.classList.add("scrolled-down");
      this.ionHeader.classList.remove("scrolled-up");

      this.tabs.classList.add("tabbar-scrolled-down");
      this.tabs.classList.remove("tabbar-scrolled-up");

      this.routerOutlet.classList.remove("mobile-header-padding");

      // this.nestedRouter.classList.remove("main-router-mobile");
      // this.nestedRouter.classList.add("main-router");
    } else if (this.lastX > scrollTop) {
      this.closeFullscreen();
      this.screen.searchHide.next(false);
      this.ionHeader.classList.remove("scrolled-down");
      this.ionHeader.classList.add("scrolled-up");

      this.tabs.classList.remove("tabbar-scrolled-down");
      this.tabs.classList.add("tabbar-scrolled-up");

      this.routerOutlet.classList.add("mobile-header-padding");
      // this.nestedRouter.classList.remove("main-router");
      // this.nestedRouter.classList.add("main-router-mobile");
    }
    this.lastX = scrollTop;
  }

  // async openVideoModal() {
  //   const modal = await this.modalController.create({
  //     component: PopoverVideoComponent,
  //     animated: true,
  //     keyboardClose: false,
  //     swipeToClose: false,
  //     backdropDismiss: false,
  //     cssClass: "video-modal",
  //   });
  //   await modal.present();
  // }

  openFullscreen() {
    const element = document.getElementById("ion-app");
    if (element) {
      // element.style.overflow = "visible";
      // element.style.height = "100vh";
      // element.style.zIndex = "999999";
      // element.requestFullscreen();
      // document.body.style.maxHeight = "100vh";
      // document.body.style.height = "100vh";
      // document.body.style.overflow = "visible";
      // document.body.style.zIndex = "999999999";
    }
    // document.documentElement
    //   .requestFullscreen({ navigationUI: "hide" })
    //   .catch();
    // document.body.style.overflow = "unset";
    // document.body.style.height = "100vh";
  }

  closeFullscreen() {
    // document.exitFullscreen();
    // document.body.style.overflow = "hidden";
    // document.body.style.height = this.defaultHeight;
  }
}
