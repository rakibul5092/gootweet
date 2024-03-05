import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { lazyImage } from "src/app/constants";
import { Product } from "src/app/models/product";

@Component({
  selector: "app-material-list",
  templateUrl: "./material-list.component.html",
  styleUrls: ["./material-list.component.scss"],
})
export class MaterialListComponent implements OnInit {
  @Input() good: any;
  @Input() slice = true;
  @Input() isProductDetails = false;
  @Output() onMaterialSelect = new EventEmitter();
  default = lazyImage;

  constructor() {}

  ngOnInit() {}

  onSelectMaterial(mat) {
    this.onMaterialSelect.emit(mat);
  }
}
