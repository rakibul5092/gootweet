import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { ModalService } from "src/app/services/modal.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-category.page.html",
  styleUrls: ["./edit-category.page.scss"],
})
export class EditCategoryPage implements OnInit {
  item: any;
  inputText: string;
  type: number = 0;
  constructor(
    private modalService: ModalService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.item = this.navParams.get("item");
      this.type = this.navParams.get("type");
      if (this.type == 1) {
        this.inputText = this.item.data.category;
      } else if (this.type == 2) {
        this.inputText = this.item.data.sub_category;
      } else if (this.type == 3) {
        this.inputText = this.item.data.inner_category;
      }
    }
  }
  close() {
    this.modalService.dismiss();
  }
  update() {
    let oldId = "";
    if (this.type == 1) {
      oldId = this.item.id;
    } else if (this.type == 2) {
      oldId = this.item.id;
    } else if (this.type == 3) {
      oldId = this.item.id;
    }
    if (oldId !== "") {
      this.modalService.dismiss({
        update: this.inputText,
        old: oldId,
        type: this.type,
      });
    }
  }
}
