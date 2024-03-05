import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { lazyImage } from "src/app/constants";
import { Message } from "src/app/models/message";
import { Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { openPhoto } from "src/app/services/functions/functions";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { GotoProfileService } from "../../../services/goto-profile.service";

@Component({
  selector: "app-message-container",
  templateUrl: "./message-container.component.html",
  styleUrls: ["./message-container.component.scss"],
})
export class MessageContainerComponent implements OnInit {
  default = lazyImage;

  @Input() selectedContact: User;
  @Input() message: Message;
  @Input() me: User;
  @Input() isOutside: boolean = false;
  @Input() isDesigner: boolean = false;

  openPhoto = openPhoto;

  constructor(
    private popoverController: PopoverController,
    private gotoProfileService: GotoProfileService,
    private openProductService: OpenSingleProductService
  ) {}

  ngOnInit() {}
  async openProduct(product: Product, productOwnerUid: string) {
    this.openProductService.openSingleProduct(product, {
      uid: productOwnerUid,
    } as any);
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }
}
