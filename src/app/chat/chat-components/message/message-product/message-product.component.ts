import { Component, Input, OnInit } from "@angular/core";
import { lazyImage } from "src/app/constants";
import { Product } from "src/app/models/product";

@Component({
  selector: "app-message-product",
  templateUrl: "./message-product.component.html",
  styleUrls: ["./message-product.component.scss"],
})
export class MessageProductComponent implements OnInit {
  default = lazyImage;

  @Input() product: any;

  constructor() {}

  ngOnInit() {}
}
