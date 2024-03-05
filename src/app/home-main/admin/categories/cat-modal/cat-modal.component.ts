import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CATEGORY_IMAGE_BASE } from "src/app/constants";
import { CategoriesService } from "../categories.service";

@Component({
  selector: "app-cat-modal",
  templateUrl: "./cat-modal.component.html",
  styleUrls: ["./cat-modal.component.scss"],
})
export class CatModalComponent implements OnInit {
  @Input() catId: string;
  selected: string = "";
  images: string[] = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "11.png",
  ];
  baseUrl = CATEGORY_IMAGE_BASE;
  constructor(
    private modalController: ModalController,
    private service: CategoriesService
  ) {}

  ngOnInit() {}
  async onCancel() {
    await this.modalController.dismiss();
  }
  async OnSet() {
    await this.service
      .updateCatImage(this.catId, this.selected)
      .then(async () => {
        await this.modalController.dismiss({ img: this.selected });
        this.selected = "";
      });
  }
}
