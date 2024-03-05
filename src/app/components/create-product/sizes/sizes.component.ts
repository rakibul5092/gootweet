import { Component, Input, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AddProductService } from "src/app/home-main/manufacturer/products/product-information/add-product.service";
import { NormalGood } from "src/app/models/product";

@Component({
  selector: "app-sizes",
  templateUrl: "./sizes.component.html",
  styleUrls: ["./sizes.component.scss"],
})
export class SizesComponent implements OnInit {
  @Input() normalGood: NormalGood;
  @Input() ownerUid: string;
  size: string;
  sizes: { id: string; name: string }[] = [];
  allColorSubs: Subscription;
  constructor(public addProductService: AddProductService) {}

  ngOnDestroy(): void {
    this.allColorSubs?.unsubscribe();
  }
  ngOnInit() {
    this.allColorSubs = this.addProductService
      .getAllColorsOrSizes(this.ownerUid, false)
      .subscribe((data) => {
        this.sizes = data;
      });
  }

  addSize(size: string) {
    if (this.size && this.size.trim().length > 0) {
      this.normalGood.sizes.push(size);
    }
  }

  removeSize(i: number) {
    this.normalGood.sizes.splice(i, 1);
  }
}
