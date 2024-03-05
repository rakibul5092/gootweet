import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { LIVE_STREAMINGS_PRODUCT_PHOTO_BASE } from "src/app/constants";
import { LiveProduct, Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { AddToCartBuyNowService } from "src/app/services/add-to-cart-buy-now.service";
import { getTimestamp } from "src/app/services/functions/functions";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
interface LiveProductMore extends LiveProduct {
  owner: User;
}
@Component({
  selector: "app-product-more-video",
  templateUrl: "./product-more-video.page.html",
  styleUrls: ["./product-more-video.page.scss"],
})
export class ProductMoreVideoPage {
  public liveProduct = new BehaviorSubject<LiveProductMore>(null);
  public me: User;
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;

  constructor(
    private nav: NavController,
    private screen: ScreenService,
    private route: ActivatedRoute,
    private liveStreamingService: LiveStreamingService,
    private loginService: LoginService,
    private addToCartBuyNowService: AddToCartBuyNowService
  ) {}
  ionViewWillEnter() {
    this.screen.fullScreen.next(true);
  }

  ionViewWillLeave() {
    this.screen.fullScreen.next(false);
  }
  async ionViewDidEnter() {
    this.me = await this.loginService.getUser();
    this.route.params.subscribe((res) => {
      if (res.id) {
        this.liveStreamingService
          .getLiveProductById(res.id)
          .subscribe((res) => {
            if (res.data) {
              this.onProductSelect(res.data);
            }
          });
      }
    });
  }

  public addToCart() {
    const liveProduct = { ...this.liveProduct.value };
    const selectedColor =
      liveProduct.colors.filter((item) => item.selected)[0]?.name || "";
    const selectedSize =
      liveProduct.sizes.filter((item) => item.selected)[0]?.name || "";
    const product: Product = {
      id: liveProduct.id,
      product_id: liveProduct.id,
      title: liveProduct.about,
      description: "",
      category: null,
      sub_category: null,
      inner_category: null,
      main_images: [this.liveProductPhotoBaseUrl + liveProduct.photo],
      measures: [],
      aditional_images: [],
      good: {
        price: liveProduct.price,
        unit: "",
        quantity: 1,
      },
      delivery_time: "",
      delivery_types: [],
      commision: "5",
      timestamp: getTimestamp(),
      ownerUid: liveProduct.ownerUid,
    };
    this.addToCartBuyNowService.addToCart(
      product,
      this.me.uid,
      null,
      false,
      this.me,
      selectedColor,
      selectedSize
    );
  }

  public onClickColorOrSize(item, items) {
    items.map((child) => (child.selected = false));
    item.selected = true;
  }

  private onProductSelect(product: LiveProductMore) {
    const prod = { ...product };
    prod.colors = prod.colors.map((item) => {
      return { name: item, selected: false };
    });
    prod.sizes = prod.sizes.map((item) => {
      return { name: item, selected: false };
    });
    this.liveProduct.next(prod);
  }

  gotoNext(url: string) {
    this.nav.navigateForward(url, {
      animated: true,
      animationDirection: "forward",
    });
  }
}
