import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  LIVE_STREAMINGS_PRODUCT_PHOTO_BASE,
  lazyImage,
} from "src/app/constants";
import { LiveProduct, Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { AddToCartBuyNowService } from "src/app/services/add-to-cart-buy-now.service";
import { AwsUploadService } from "src/app/services/aws-upload.service";
import { getTimestamp } from "src/app/services/functions/functions";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-live-products",
  templateUrl: "./live-products.component.html",
  styleUrls: ["./live-products.component.scss"],
})
export class LiveProductsComponent {
  @ViewChild("contextMenu") popover;
  @Input() liveProducts: LiveProduct[];
  @Input() allProducts: LiveProduct[];
  @Input() uid: string;
  @Input() isGalary = false;
  @Input() me: User;
  @Input() editableProduct: LiveProduct = null;
  @Input() menuVisible = false;
  @Output() onEdit = new EventEmitter(null);
  @Output() onDelete = new EventEmitter(null);
  public selectedProduct: LiveProduct;
  public default = lazyImage;
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;

  constructor(
    private nav: NavController,
    private addToCartService: AddToCartBuyNowService,
    private utils: UtilityService,
    private streamService: LiveStreamingService,
    private uploaderService: AwsUploadService
  ) {}

  public onContinue(id: string) {
    this.nav.navigateForward("/product-more-video/" + id, {
      animated: true,
      animationDirection: "forward",
    });
  }

  public addToCart(product: LiveProduct) {
    let sizes = [];
    if (product.sizes) {
      sizes = product.sizes
        .filter((item) => item.selected)
        .map((item) => item.name);
    }
    let colors = [];
    if (product.colors) {
      colors = product.colors
        .filter((item) => item.selected)
        .map((item) => item.name);
    }
    const newProduct: Product = {
      good: {
        sizes: sizes,
        price: product.price,
        quantity: 1,
        unit: "",
        colors: colors,
      },
      id: product.id,
      product_id: product.id,
      title: product.title,
      category: null,
      sub_category: null,
      description: product.about,
      main_images: [this.liveProductPhotoBaseUrl + product.photo],
      inner_category: null,
      measures: [],
      aditional_images: [],
      delivery_time: "",
      delivery_types: [],
      commision: "",
      timestamp: getTimestamp(),
      ownerUid: product.ownerUid,
    };

    this.addToCartService.addToCart(
      newProduct,
      newProduct.ownerUid,
      null,
      false,
      this.me,
      null,
      null
    );
  }
  public makePayment() {
    this.addToCartService.buyNow();
  }

  public onClickColorOrSize(item, items) {
    items.map((child) => (child.selected = false));
    item.selected = true;
  }

  onProductSelect(product: LiveProduct) {
    const prod = { ...product };
    prod.colors = prod.colors.map((item) => {
      return { name: item, selected: false };
    });
    prod.sizes = prod.sizes.map((item) => {
      return { name: item, selected: false };
    });
    this.selectedProduct = prod;
  }

  onOptionClick(event, product: LiveProduct) {
    event.stopPropagation();
    this.popover.event = event;
    this.editableProduct = product;
  }
  async onContextButtonClick(isEdit = true, product: LiveProduct) {
    if (isEdit) {
      this.onEdit.emit(product);
    } else {
      const response = await (
        await this.utils.askDeletePermission()
      ).onDidDismiss();
      if (response.data.confirm) {
        this.streamService.deleteCatalogById(product.id);
        this.uploaderService.removeImages("live_products", [product.photo]);
      }
    }
  }
}
