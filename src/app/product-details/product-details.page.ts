import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MenuController, NavController } from "@ionic/angular";
import { ChatService } from "../chat/chat-designer/chat.service";
import { VisibleService } from "../chat/chat-designer/visible.service";
import { ChatsService } from "../chats/chats.service";
import { HeaderService } from "../components/layouts/header/header.service";
import { CartListPopupService } from "../components/popovers/cart-list-popup/cart-list-popup.service";
import { SliderService } from "../components/product/slider/slider.service";
import { lazyImage, product_video_base } from "../constants";
import { ProductsService } from "../home-main/manufacturer/products/products.service";
import { ProfileService } from "../home-main/manufacturer/profile-test/profile.service";
import {
  Delivery,
  NormalGood,
  Product,
  VariationGood,
} from "../models/product";
import { User } from "../models/user";
import { AddToCartBuyNowService } from "../services/add-to-cart-buy-now.service";
import { LoginService } from "../services/login.service";
import { ProductPopupService } from "../services/product-popup.service";
import { ScreenService } from "../services/screen.service";
import { UtilityService } from "../services/utility.service";
import { SendUserMessengerPage } from "../chat/send-user-messenger/send-user-messenger.page";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.page.html",
  styleUrls: ["./product-details.page.scss"],
})
export class ProductDetailsPage implements OnInit {
  private productOwnerUid: string;
  public productId: string;
  public me: User;
  public product: Product;
  public productOwner: User;
  private selectedImage: string = "";
  private selectedSize: string = "";
  public shortened = true;

  default = lazyImage;
  colors = [];
  sizes = [];
  shoesSizes = [];
  public deliveryType: Delivery = null;
  public haveMaterial = false;
  public isMobile = false;
  public informationVisible = false;
  public productVideoBase = product_video_base;
  public haveVideo = false;
  productQty = 1;
  isDesigner = false;
  mainProductSelectedMat: any;
  selectedColor: any;
  qtyErrMsg: string = "";
  constructor(
    public productPopupService: ProductPopupService,
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private designerChat: ChatService,
    private normalChat: ChatsService,
    private storage: LoginService,
    private sliderService: SliderService,
    private visibilityService: VisibleService,
    private screen: ScreenService,
    private menuController: MenuController,
    private profileService: ProfileService,
    private nav: NavController,
    private headerService: HeaderService,
    private addTocartService: AddToCartBuyNowService,
    private cartListPopupService: CartListPopupService,
    private utils: UtilityService
  ) {}

  ionViewWillEnter = () => {
    this.screen.width.subscribe((res) => {
      if (res < 1140) {
        this.screen.fullScreen.next(true);
        this.visibilityService.showLayout.next(true);
        this.isMobile = true;
        this.menuController.swipeGesture(false);
      } else {
        this.isMobile = false;
      }
    });
  };
  ionViewWillLeave = () => {
    this.screen.fullScreen.next(false);
    this.menuController.swipeGesture(true);
    const video: HTMLVideoElement = document.getElementById(
      "gootweet-video-player"
    ) as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  };

  async ngOnInit() {
    this.me = await this.storage.getUser();

    if (!this.productPopupService.productData) {
      this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
        const pathVariableSplit = paramMap.get("id").split("-");
        this.productId = pathVariableSplit[pathVariableSplit.length - 2];
        this.productOwnerUid = pathVariableSplit[pathVariableSplit.length - 1];
        this.productService
          .getProductWithOwnerInfo(this.productOwnerUid, this.productId)
          .subscribe((query) => {
            if (query[0].exists && query[1].exists) {
              this.productOwner = query[0].data() as User;
              this.product = {
                ...(query[1].data() as Product),
                id: query[1].id,
              };
              this.initPriceAndQuantity();
            }
          });
      });
    } else {
      this.productOwner = this.productPopupService.productData.productOwner;
      this.product = this.productPopupService.productData.product;
      this.productId = this.product.id;
      if (!this.productOwner.rule) {
        this.profileService
          .getProductOwner(this.productOwner.uid)
          .get()
          .subscribe((res) => {
            if (res.exists) this.productOwner = res.data() as User;
          });
      }

      this.initPriceAndQuantity();
    }
  }

  ended(event) {
    if (event) {
      this.haveVideo = false;
      const slider = document.getElementById(
        "productMoreMobileSlider" + this.productId
      );
      const container = document.getElementById(
        "productMoreMobileSliderContainer" + this.productId
      );
      container.style.minHeight = "unset";
      container.style.height = "unset";
    }
  }

  private initPriceAndQuantity() {
    if (this.product.video && this.product.video !== "") {
      this.haveVideo = true;
    } else {
      this.haveVideo = false;
    }
    this.productPopupService
      .getDeliveryInfo(this.productOwner.uid)
      .subscribe((query) => {
        if (query.exists) {
          this.deliveryType = (query.data() as any).delivery[0];
        }
      });
    this.product.main_images = [
      ...this.product.main_images,
      ...this.product.aditional_images,
    ];
    if (Array.isArray(this.product.good)) {
      this.haveMaterial = true;
      this.mainProductSelectedMat = (this.product.good as VariationGood[])[0];
    } else {
      this.haveMaterial = false;
      this.colors = (this.product.good as NormalGood)?.colors?.map((item) => {
        return { name: item, selected: false };
      });

      this.sizes = (this.product.good as NormalGood)?.sizes?.map((item) => {
        return { name: item, selected: false };
      });
    }
  }
  public onOtherPhotoClick(index: number) {
    this.sliderService.onSliderChange.next(index);
    this.selectedImage = this.product.main_images[index];
    this.haveVideo = false;
    this.cdr.detectChanges();
  }

  public onSelection(
    array: { name: string; selected: boolean }[],
    index: number,
    type: string
  ) {
    array.map((item) => {
      item.selected = false;
    });
    array[index].selected = true;
    if (type === "color") {
      this.selectedColor = array[index].name;
    } else {
      this.selectedSize = array[index].name;
    }
  }

  onSlideChange(event) {
    this.selectedImage = this.product?.main_images[event.index] || "";
  }

  public async sendToMessenger() {
    if (this.me) {
      let prod: Product = this.product;
      if (this.selectedImage && this.selectedImage !== "") {
        prod = { ...this.product, main_images: [this.selectedImage] };
      }
      if (Array.isArray(prod.good)) {
        prod.good = this.mainProductSelectedMat;
      }
      if (prod) {
        if (this.me.rule == "designer") {
          this.designerChat.selectedProduct = {
            data: prod,
            id: this.product.id,
            owner: this.productOwner,
          };
        } else {
          this.normalChat.selectedProduct = {
            data: prod,
            id: this.product.id,
            owner: this.productOwner,
          };
          await this.utils.openContactsModal(SendUserMessengerPage, false);
        }
        // await this.headerService.openChat(
        //   null,
        //   this.screen.width.value < 900 ? "chat-pop" : "chat-pop-share"
        // );
      }
    }
    // this.sendMessageService.sendMessage(this.me, this.productOwner);
  }

  public goToProfileCatalog() {
    let ownerName =
      this.productOwner.full_name.first_name.replace(/\s/g, "-") +
      "-" +
      this.productOwner.full_name.last_name.replace(/\s/g, "-");
    let ownerUid = this.productOwner.uid;
    this.router.navigate([`profile/${ownerName}/${ownerUid}/catalog`]);
  }

  public onMaterialSelect(event) {
    this.mainProductSelectedMat = event;
  }

  public async addToCart(product: Product, ownerId: string) {
    let prod: Product = product;
    if (this.selectedImage && this.selectedImage !== "") {
      prod = { ...product, main_images: [this.selectedImage] };
    }
    this.addTocartService.addToCart(
      prod,
      this.productOwner.uid,
      this.mainProductSelectedMat,
      this.isDesigner,
      this.me,
      this.selectedColor,
      this.selectedSize
    );
  }

  public buyNow() {
    this.addTocartService.buyNow();
  }
  openCartPopover() {
    if (this.me) {
      this.cartListPopupService.openCartPopover(null);
    } else {
      this.nav.navigateForward("purchase");
    }
  }
}
