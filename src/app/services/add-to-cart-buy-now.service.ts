import { Injectable, Injector } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ChatService } from "../chat/chat-designer/chat.service";
import { CartListPopupService } from "../components/popovers/cart-list-popup/cart-list-popup.service";
import {
  NormalGood,
  Product,
  ProductForCart,
  VariationGood,
} from "../models/product";
import { User } from "../models/user";
import { getTimestamp } from "./functions/functions";
import { ProductPopupService } from "./product-popup.service";
import { UtilityService } from "./utility.service";

@Injectable({
  providedIn: "root",
})
export class AddToCartBuyNowService {
  constructor(
    private productPopupService: ProductPopupService,
    private designerChat: ChatService,
    private utilityService: UtilityService,
    private injector: Injector,
    private nav: NavController,
    private cartPopupService: CartListPopupService
  ) {}

  public async addToCart(
    product: Product,
    ownerId: string,
    mainProductSelectedMat: any,
    isDesigner = false,
    me: User,
    selectedColor: string,
    selectedSize: string
  ) {
    let prod: any = {
      ...product,
      selectedImage: product.main_images[0],
    } as ProductForCart;
    prod.cart_time = getTimestamp();
    if (mainProductSelectedMat) {
      const totalUnitOfMeasurement = +mainProductSelectedMat?.quantity || 0;
      prod.totalUnitOfMeasurment =
        Number(Number(totalUnitOfMeasurement).toFixed(2)) || 0;
    }
    prod.ownerId = ownerId;
    prod.seen = false;

    prod.cart_price = +(
      mainProductSelectedMat?.price ||
      (Array.isArray(product.good)
        ? (product.good as VariationGood[])[0].price
        : (product.good as NormalGood).price)
    );

    if (isDesigner) {
      prod.isDesigner = true;
      prod.designerId = me.uid;
    } else {
      prod.isDesigner = false;
    }
    if (Array.isArray(product.good)) {
      prod.good = mainProductSelectedMat;
    } else {
      (prod.good as NormalGood).colors = [];
      (prod.good as NormalGood).sizes = [];
      if (selectedColor && selectedColor !== "") {
        (prod.good as NormalGood).colors = [selectedColor];
      }
      if (selectedSize && selectedSize !== "") {
        (prod.good as NormalGood).sizes = [selectedSize];
      }
    }
    prod.quantity = 1; //need to confirm about quantity when click the same product multiple times...
    if (me) {
      if (isDesigner && this.designerChat.selectedContact) {
        await this.productPopupService
          .addToCart(
            prod,
            isDesigner ? this.designerChat.selectedContact.uid : me?.uid
          )
          .then(async () => {
            await this.utilityService.showToast(
              "Prekė įdėta į krepšelį",
              "success"
            );
          })
          .catch(async (err) => {
            await this.utilityService.showToast(
              "Bandykite dar kartą...",
              "error"
            );
          });
      } else {
        await this.productPopupService
          .addToCart(prod, me.uid)
          .then(async () => {
            await this.cartPopupService.openCartPopover(null, "md", true);
            await this.utilityService.showToast(
              "Prekė įdėta į krepšelį",
              "success"
            );
          })
          .catch(async (err) => {
            await this.utilityService.showToast(
              "Bandykite dar kartą...",
              "error"
            );
            console.log(err);
          });
      }
    } else {
      await this.productPopupService
        .addToLocalCart(prod)
        .then(async () => {
          await this.cartPopupService.openCartPopover(null, "md", true);
          this.cartPopupService.getLocalCartItems();
          await this.utilityService.showToast(
            "Prekė įdėta į krepšelį!",
            "success"
          );
        })
        .catch(async (err) => {
          await this.utilityService.showToast(
            "Bandykite dar kartą...",
            "danger"
          );
        });
    }
  }

  public buyNow() {
    this.nav.navigateForward("select-payment-method", {
      animated: true,
      animationDirection: "forward",
    });
  }
}
