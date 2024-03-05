import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AddProductService } from "src/app/home-main/manufacturer/products/product-information/add-product.service";
import { NormalGood } from "src/app/models/product";

@Component({
  selector: "app-colors",
  templateUrl: "./colors.component.html",
  styleUrls: ["./colors.component.scss"],
})
export class ColorsComponent implements OnInit, OnDestroy {
  @Input() normalGood: NormalGood;
  @Input() ownerUid: string;
  selectedColor: string;
  colors: { id: string; name: string }[] = [];
  allColorSubs: Subscription;
  constructor(private addProductService: AddProductService) {}

  ngOnDestroy(): void {
    this.allColorSubs?.unsubscribe();
  }

  ngOnInit() {
    this.getAllColor();
  }

  addToCollection() {
    this.addProductService.addToCollection(true, this.colors, [], null);
  }

  getAllColor() {
    this.allColorSubs = this.addProductService
      .getAllColorsOrSizes(this.ownerUid, true)
      .subscribe((data) => {
        this.colors = data;
      });
  }

  addColor(col: string) {
    if (this.selectedColor && this.selectedColor.trim().length > 0) {
      this.normalGood.colors.push(col);
    }
  }

  removeColor(i: number) {
    this.normalGood.colors.splice(i, 1);
  }
}
