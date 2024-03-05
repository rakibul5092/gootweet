import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { lazyImage, users } from "src/app/constants";
import { Delivery, Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { AddToCartBuyNowService } from "src/app/services/add-to-cart-buy-now.service";
import { getUser } from "src/app/services/functions/functions";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { ProductPopupService } from "src/app/services/product-popup.service";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-quick-view",
  templateUrl: "./quick-view.component.html",
  styleUrls: ["./mobile-preview.page.scss"],
})
export class QuickViewComponent implements OnInit, OnDestroy {
  quickViewProduct: Product;
  quickViewOwner = null;
  default = lazyImage;
  prodImages = [];
  viewImage = [];
  me: User;
  colors = [
    "#6a7bff",
    "#26A65B",
    "#049372",
    "#C3272B",
    "#8E44AD",
    "#FFA400",
    "#95A5A6",
    "#6a7bff",
    "#26A65B",
    "#049372",
    "#C3272B",
    "#8E44AD",
    "#FFA400",
    "#95A5A6",
    "#6a7bff",
  ];
  subs: Subscription[] = [];
  deliveryType: Delivery = null;
  constructor(
    private openSingleProduct: OpenSingleProductService,
    public productPopupService: ProductPopupService,
    private firestore: AngularFirestore,
    private screen: ScreenService,
    private addTocartService: AddToCartBuyNowService
  ) {}
  ngOnDestroy(): void {
    this.subs.forEach((item) => {
      item.unsubscribe();
    });
  }

  ngOnInit() {
    getUser().then((user) => {
      this.me = user;
    });
    this.subs.push(
      this.screen.onQuickView.subscribe((value) => {
        if (value) {
          this.quickView(value.product, value.uid);
          console.log(value.product);

          this.productPopupService.getDeliveryInfo(value.uid);
          this.productPopupService
            .getDeliveryInfo(value.uid)
            .subscribe((query) => {
              if (query.exists) {
                this.deliveryType = (query.data() as any).delivery[0];
              }
            });
        }
      })
    );

    this.subs.push(
      this.screen.onCloseQuickView.asObservable().subscribe((value) => {
        if (value) {
          this.closeQuickView();
        }
      })
    );
  }

  async quickView(product: any, ownerUid: string) {
    this.quickViewOwner = null;
    this.quickViewProduct = product;
    this.prodImages = [
      ...this.quickViewProduct.main_images,
      ...this.quickViewProduct.aditional_images,
    ];

    if (!this.quickViewProduct.video || this.quickViewProduct.video == "") {
      this.viewImage = [...this.prodImages];
    }
    setTimeout(() => {
      this.firestore
        .collection(users)
        .doc(ownerUid)
        .get()
        .pipe(first())
        .subscribe((uQuery) => {
          this.quickViewOwner = uQuery.data() as User;
        });
    }, 300);
  }

  addToCart() {
    console.log(this.quickViewProduct);
    const prod = Array.isArray(this.quickViewProduct.good)
      ? { ...this.quickViewProduct, good: this.quickViewProduct.good[0] }
      : this.quickViewProduct;
    this.addTocartService.addToCart(
      prod,
      this.quickViewOwner.uid,
      null,
      false,
      this.me,
      "",
      ""
    );
  }

  buyNow() {
    this.addTocartService.buyNow();
  }

  openProduct(product) {
    this.openSingleProduct.openSingleProduct(
      { ...product },
      { ...this.quickViewOwner }
    );
    this.closeQuickView();
  }

  closeQuickView() {
    this.quickViewProduct = null;
    this.quickViewOwner = null;
    this.prodImages = [];
    this.viewImage = [];
    setTimeout(() => {
      const quickView = document.getElementById("quick-view");
      quickView?.classList?.remove("quick-view-show");
      quickView?.classList?.add("quick-view-hidden");
    }, 300);
  }
}
