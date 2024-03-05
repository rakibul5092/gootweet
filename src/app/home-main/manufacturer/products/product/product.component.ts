import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Product } from "src/app/models/product";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @Input() product: any;
  @Output() copyMessageEvent: EventEmitter<any> = new EventEmitter();
  @Output() onProductOpenEvent: EventEmitter<Product> = new EventEmitter();
  @Output() onDeletePermissionEvent: EventEmitter<any> = new EventEmitter();
  @Output() onOpenSettingEvent: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() { }
  copyMessage(pid: string) {
    this.copyMessageEvent.emit(pid);
  }
  openSingleProduct() {
    this.onProductOpenEvent.emit(this.product);
  }
  askPermissionForDelete() {
    this.onDeletePermissionEvent.emit({
      product: this.product
    });
  }
  openSetting() {
    this.onOpenSettingEvent.emit(this.product.id);
  }

}
