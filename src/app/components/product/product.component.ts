import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChatsService } from "src/app/chats/chats.service";
import { lazyImage } from "src/app/constants";
import { ChatService } from "../../chat/chat-designer/chat.service";
import { SendDesignerMessengerPage } from "../../chat/send-designer-messenger/send-designer-messenger.page";
import { Product, ProductForChat } from "../../models/product";
import { User } from "../../models/user";
import { OpenSingleProductService } from "../../services/open-single-product.service";
import { ScreenService } from "../../services/screen.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent {
  @Input() product: any;
  @Input() productOwner;
  @Input() isDesignerLoggedIn;
  @Input() searched: boolean = false;
  @Input() isSearchPopup: boolean = false;
  @Input() profile = false;
  @Input() isSubcategory = false;
  @Input() isWeb = true;
  @Input() index = 0;
  @Output() openSearchedProductEvent = new EventEmitter();
  @Output() sendTMSearchedEvent = new EventEmitter();
  default = lazyImage;

  constructor(
    private openSingleProductService: OpenSingleProductService,
    private util: UtilityService,
    private designerChat: ChatService,
    private screen: ScreenService,
    private normalChat: ChatsService
  ) {}

  drag(event: any, product: Product, owner: User) {
    if (this.searched) {
    } else {
      let p: ProductForChat = {
        data: product,
        id: product.id,
        owner: owner,
      };
      event.dataTransfer.setData("product", JSON.stringify(p));
    }
  }

  productPopup(product, productOwner) {
    if (this.searched) {
      this.openSearchedProductEvent.emit({
        uid: product?.uid,
        id: product.objectID,
      });
    } else {
      console.log("manufacturer from sub category:", this.productOwner);

      this.openSingleProductService.openSingleProduct(product, productOwner);
    }
  }

  quickView() {
    this.screen.onQuickView.next({
      product: this.product,
      uid: this.productOwner.uid,
    });
  }

  async sendToMessenger(product: any) {
    if (this.isSubcategory) {
      document.getElementById("navNoti-chat")?.click();
    }
    if (this.searched) {
      this.sendTMSearchedEvent.emit({ pId: product.objectID });
    } else {
      if (product) {
        if (this.isDesignerLoggedIn) {
          this.designerChat.selectedProduct = {
            data: product,
            id: product.id,
            owner: this.productOwner,
          };
        } else {
          this.normalChat.selectedProduct = {
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
  }
}
