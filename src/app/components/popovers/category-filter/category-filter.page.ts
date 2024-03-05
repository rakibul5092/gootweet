import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ProductsService } from "src/app/home-main/manufacturer/products/products.service";

@Component({
  selector: "app-category-filter",
  templateUrl: "./category-filter.page.html",
  styleUrls: ["./category-filter.page.scss"],
})
export class CategoryFilterPage implements OnInit {
  constructor(
    public service: ProductsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
