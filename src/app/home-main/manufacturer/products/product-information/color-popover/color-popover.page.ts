import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AddProductService } from "../add-product.service";
import { getTimestamp } from "../../../../../services/functions/functions";

@Component({
  selector: "app-color-popover",
  templateUrl: "./color-popover.page.html",
  styleUrls: ["./color-popover.page.scss"],
})
export class ColorPopoverPage implements OnInit {
  @Input() isColor: boolean = true;
  @Input() colors: { id: string; name: string }[];
  @Input() sizes: { id: string; name: string }[];
  @Input() ownerUid: string;
  item: string;

  constructor(
    private modal: ModalController,
    private addService: AddProductService
  ) {}

  ngOnInit() {}

  add() {
    let timestamp = getTimestamp();
    if (this.item && this.item.trim().length > 0) {
      this.addService
        .addColorOrSize(this.item, timestamp, this.isColor, this.ownerUid)
        .then((res) => {
          if (this.isColor) {
            this.colors.splice(0, 0, { id: this.item, name: this.item });
          } else {
            this.sizes.splice(0, 0, { id: this.item, name: this.item });
          }
          this.item = "";
        });
    }
  }

  delete(item, index: number) {
    if (this.isColor) {
      this.colors.splice(index, 1);
    } else {
      this.sizes.splice(index, 1);
    }
    this.addService.deleteColorOrSize(item, this.isColor, this.ownerUid);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
