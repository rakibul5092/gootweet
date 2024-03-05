import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-share-product",
  templateUrl: "./share-product.component.html",
  styleUrls: ["./share-product.component.scss"],
})
export class ShareProductComponent {
  @Input() product: any;
  @Output() onClose = new EventEmitter();
  default = "../../assets/loading.svg";

  constructor() {}
  close() {
    this.onClose.emit("");
  }
}
