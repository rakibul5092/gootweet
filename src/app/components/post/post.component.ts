import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { lastValueFrom } from "rxjs";
import { first } from "rxjs/operators";
import { WallpostButtons } from "src/app/enums/enums";
import { SendMessageService } from "src/app/home-main/manufacturer/profile-test/send-message.service";
import { Product, RecomandedProduct } from "src/app/models/product";
import { getTimestamp } from "src/app/services/functions/functions";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import SwiperCore, { Navigation, SwiperOptions } from "swiper";
import { SwiperComponent } from "swiper/angular";
import { NOTIFICATION_TYPE, comments, reactions } from "../../constants";
import { NotificationData } from "../../models/notifications";
import { User } from "../../models/user";
import { Comment, WallPost } from "../../models/wall-test";
import {
  getComments,
  getReactions,
  getWhoTyping,
} from "../../services/functions/wall_post_functions";
import { GotoProfileService } from "../../services/goto-profile.service";
import { ScreenService } from "../../services/screen.service";
import { UtilityService } from "../../services/utility.service";
import { RequestPopupPage } from "../popovers/request-popup/request-popup.page";
import { WallContextMenuPage } from "./menu-items/wall-context-menu/wall-context-menu.page";
import { PostService } from "./post.service";
import { ChatService } from "src/app/chat/chat-designer/chat.service";
import { ChatsService } from "src/app/chats/chats.service";
import { HomeService } from "src/app/home-main/home.service";
import { FollowService } from "src/app/home-main/tracking-manufacturers/follow.service";
// declare var Viewer: any;
SwiperCore.use([Navigation]);
@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent implements OnInit {
  @ViewChild("randomSwiper", { static: false }) swiper?: SwiperComponent;

  @Input() wallPost: WallPost;
  @Input() me: User;
  @Input() isLoggedin: boolean;
  @Input() isAllComment = false;
  @Input() sliderShow = false;
  @Output() typeChange = new EventEmitter();
  @Output() action = new EventEmitter();
  @Input() isPopoverVideo = false;
  @Input() showReels = false;
  public isFollowed = false;
  public followButtonDisabled = true;
  public reactions = [
    { type: 1, icon: "like" },
    { type: 2, icon: "love" },
    { type: 3, icon: "haha" },
    { type: 4, icon: "wow" },
    { type: 5, icon: "sad" },
    { type: 6, icon: "angry" },
  ];
  randomProducts: RecomandedProduct[] = [];
  isMyProfile: boolean = false;
  isDesignerPost: boolean = false;
  isNormalUser: boolean = false;
  startCommenting = false;
  connectionCalled = false;
  buttons = WallpostButtons;
  private hoverTimer: any;
  private hoverDuration = 700;

  config: SwiperOptions = {
    spaceBetween: 5,
    width: 228,
    allowSlideNext: true,
    allowSlidePrev: true,
    freeMode: true,
    on: {
      resize: () => {
        const parent = document.getElementById(
          "slider-category-container-" + this.wallPost.id
        );
        const firstSlide = parent.getElementsByClassName(
          "swiper-slide"
        )[0] as HTMLDivElement;
        if (firstSlide) {
          firstSlide.style.width = "200px";
        }
      },
    },
  };
  showProfile = false;
  isEmojiPickerVisible = false;
  addEmoji(isReply: boolean, event, comment: Comment) {
    if (isReply) {
      comment.replyCommentText = `${comment.replyCommentText}${event.emoji.native}`;
      this.isEmojiPickerVisible = false;
    } else {
      this.wallPost.commentText = `${this.wallPost.commentText}${event.emoji.native}`;
      this.isEmojiPickerVisible = false;
    }
  }

  startTimer() {
    this.hoverTimer = setTimeout(() => {
      this.toggleReactions("flex");
    }, this.hoverDuration);
  }

  cancelTimer() {
    clearTimeout(this.hoverTimer);
    setTimeout(() => {
      this.toggleReactions("none");
    }, 500);
  }

  public toggleReactions(action: string) {
    const reactionContainer = document.getElementById(
      "reactions-" + this.wallPost.id
    );
    if (reactionContainer) {
      reactionContainer.style.display = action;
    }
  }

  constructor(
    private popoverController: PopoverController,
    private postService: PostService,
    private util: UtilityService,
    public screen: ScreenService,
    private router: Router,
    private gotoProfileService: GotoProfileService,
    public singleProductService: OpenSingleProductService,
    private sendMessageService: SendMessageService,
    private modalCtrl: ModalController,
    private designerChat: ChatService,
    private normalChat: ChatsService,
    private homeService: HomeService,
    private nav: NavController,
    private followService: FollowService
  ) {}

  nextSlide() {
    this.swiper?.swiperRef.slideNext();
  }
  prevSlide() {
    this.swiper?.swiperRef.slidePrev();
  }

  onCommentClick() {
    this.startCommenting = true;
  }
  openProduct(product: Product, event: any) {
    this.singleProductService.openSingleProduct(
      this.randomProducts[event].product,
      this.randomProducts[event].owner
    );
  }

  async ngOnInit() {
    if (this.sliderShow) {
      this.postService
        .getRandomProducts()
        .pipe(first())
        .subscribe((res: any) => {
          if (res.success) {
            this.randomProducts = res.products;
          }
        });
    }

    if (this.router.url.startsWith("/profile/")) {
      this.isMyProfile = this.wallPost?.data?.owner?.uid == this.me?.uid;
    }
    this.isDesignerPost = this.wallPost.data.owner.rule == "designer";
    this.isNormalUser = this.wallPost.data.owner.rule == "user";
    this.wallPost.isCommentAll = this.isAllComment;
    try {
      this.postService
        .getMyReaction(this.wallPost.id, this.me.uid)
        .subscribe((query) => {
          if (query.payload.exists) {
            this.wallPost.reacted = query.payload.data();
          }
        });

      this.postService.getLiveWallData(this.wallPost.id).subscribe((query) => {
        if (query.payload.exists) {
          this.wallPost.data = query.payload.data() as any;
        }
      });
      // getReactions(
      //   this.wallPost.collection
      //     .doc(this.wallPost.id)
      //     .collection(reactions, (ref) => ref.orderBy("timestamp", "asc")),
      //   this.wallPost.userCollection
      // )

      this.wallPost.comments = getComments(
        this.wallPost.collection
          .doc(this.wallPost.id)
          .collection(comments, (ref) => ref.orderBy("timestamp", "asc")),
        this.wallPost.userCollection
      );
      this.wallPost.whoTyping = getWhoTyping(
        this.wallPost.collection
          .doc(this.wallPost.id)
          .collection("typing")
          .doc("1234567890")
      );

      this.wallPost.userCollection
        .doc(this.wallPost.data.owner.uid)
        .snapshotChanges()
        .subscribe((res) => {
          this.wallPost.data.owner = res.payload.data() as unknown as User;
          this.followButtonDisabled = false;
        });

      setTimeout(() => {
        this.showProfile = true;
      }, 1000);
      this.followService
        .isFollowed(this.wallPost.data.owner.uid, this.me.uid)
        .subscribe((res) => {
          this.isFollowed = res !== null;
        });
    } catch (err) {}
  }

  public changeFollow() {
    this.followButtonDisabled = true;
    if (this.isFollowed) {
      this.followService
        .removeFollows(this.wallPost.data.owner.uid, this.me.uid)
        .then(() => {
          this.followButtonDisabled = false;
        });
    } else {
      this.followService
        .addFollow(this.wallPost.data.owner.uid, this.me)
        .then(() => {
          this.followButtonDisabled = false;
        });
    }
  }

  onClick() {
    this.sendMessageService.sendMessage(this.me, this.wallPost?.data?.owner);
  }

  async openRequestPopover() {
    if (this.me) {
      const data = {
        walPost: this.wallPost,
        index: 0,
      };
      const requestModal = await this.modalCtrl.create({
        component: RequestPopupPage,
        componentProps: data,
        cssClass:
          this.screen.width.value > 767
            ? "request-popover"
            : "request-popover-mobile",
        mode: "ios",
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.25, 0.5, 0.75],
      });
      await requestModal.present();
    } else {
      this.router.navigate(["login"]);
    }
  }

  async openWallPostMenu(
    event: any,
    isMe: boolean,
    postId: string,
    type: number
  ) {
    let data = {
      isMe: isMe,
      postId: postId,
      myUid: this.me?.uid,
      type: type,
    };
    let menu = await this.popoverController.create({
      component: WallContextMenuPage,
      event: event,
      componentProps: data,
      translucent: true,
      mode: "ios",
    });
    menu.onDidDismiss().then((res) => {
      if (res?.data) {
        this.action.emit(res.data);
      }
    });
    return menu.present();
  }

  async scrollTo(element: string) {
    document.getElementById(element)?.scrollIntoView({ block: "end" });
  }

  viewAllComment(wallPost: WallPost) {
    wallPost.isCommentAll = true;
    this.startCommenting = true;
    setTimeout(() => {
      this.scrollTo("input" + wallPost.id);
    }, 500);
  }

  commentTyping(wallPost: WallPost) {
    if (wallPost.commentText.trim() !== "") {
      this.postService.commentTypingFunction(
        wallPost,
        this.me?.full_name?.first_name + " " + this.me?.full_name?.last_name,
        this.me?.uid
      );
    }
  }

  async sendReaction(reaction: { type: number; icon: string }) {
    if (this.me) {
      let timestamp = getTimestamp();
      await this.postService.react(
        this.wallPost.id,
        this.me?.uid,
        reaction,
        timestamp
      );
      this.toggleReactions("none");
      let notificationData: NotificationData = {
        type: NOTIFICATION_TYPE.REACTION,
        seen: false,
        timestamp: timestamp,
        request_data: null,
        comment_data: null,
        senderInfo: this.me,
        reaction_data: {
          reaction_id: "",
          wall_post_id: this.wallPost.id,
          reaction: reaction,
          reactor_uid: this.me?.uid,
          timestamp: timestamp,
        },
      };
      this.postService
        .insertNotification(notificationData)
        .pipe(first())
        .subscribe((res) => {});
    } else {
      console.log(this.me, this.wallPost.data.owner.uid, this.me.uid);
    }
  }

  sendComments(wall: WallPost, commenter_uid: string) {
    if (wall.commentType === 1 && wall.commentText == "") return;
    wall.isCommentAll = true;
    if (wall.commentForEdit) {
      this.postService.updateComments(wall);
    } else {
      let timestamp = getTimestamp();
      this.postService.sendComments(
        wall.id,
        this.wallPost.data.owner.uid,
        commenter_uid,
        wall.commentText,
        timestamp,
        this.me,
        this.wallPost.commentType,
        this.wallPost.gif
      );
    }
    wall.commentForEdit = null;
    wall.commentText = "";
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  openSharePopup() {
    // this.title.setTitle(this.wallPost.data.title);
    let postUrl = "";
    postUrl = "https://gootweet.com/wallpost?id=" + this.wallPost.id;
    let data = {
      url: postUrl,
      title: this.wallPost.data.title,
      description: this.wallPost.data.description,
      // image: this.wallPost.data.coverImage
      //   ? this.wallPost.data.coverImage
      //   : this.wallPost.data.products && this.wallPost.data.products.length > 0
      //   ? this.wallPost.data.products[0].main_images[0]
      //   : this.wallPost.data.images && this.wallPost.data.images.length > 0
      //   ? this.wallPost.data.images[0]
      //   : "",
    };
    this.util.openSharePopup(data);
  }
  async sendToMessenger(ev, product: Product, owner: User) {
    if (!this.me) {
      this.router.navigate(["/login"]);
    } else {
      ev.stopPropagation();
      if (product) {
        if (this.me.rule === "designer") {
          this.designerChat.selectedProduct = {
            data: product,
            id: product.id,
            owner: owner,
          };
        } else {
          this.normalChat.selectedProduct = {
            data: product,
            id: product.id,
            owner: owner,
          };
        }
        this.sendMessageService.sendMessage(this.me, owner);
      }
    }
  }

  public openMarketPlace() {
    let url = "";
    if (this.screen.width.value < 768) {
      url = "filter/mobile-category";
    } else {
      url = "categories";
    }
    this.nav.navigateForward(url, {
      animated: true,
      animationDirection: "forward",
    });
  }

  public openMessenger() {
    if (this.me) {
      this.sendMessageService.sendMessage(this.me, this.wallPost.data.owner);
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
