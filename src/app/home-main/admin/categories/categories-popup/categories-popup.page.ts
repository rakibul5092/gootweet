import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { LoginService } from "src/app/services/login.service";
import { ModalService } from "src/app/services/modal.service";
import { AddCategoriesService } from "./add-categories.service";
import { getUser } from "../../../../services/functions/functions";
import { CategoriesService } from "../categories.service";

@Component({
  selector: "app-categories-popup",
  templateUrl: "./categories-popup.page.html",
  styleUrls: ["./categories-popup.page.scss"],
})
export class CategoriesPopupPage implements OnInit {
  me: User;
  constructor(
    public service: AddCategoriesService,
    public categoriesService: CategoriesService,
    private modalService: ModalService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      this.me = user;
      this.service.init(user);
    });
  }

  async doOrder(event) {
    // new order of items

    const from = this.service.subCategories[event?.detail.from].data.serial;
    const to = this.service.subCategories[event?.detail.to].data.serial;
    const subCatIdFrom = this.service.subCategories[event?.detail.from].id;
    const subCatIdTo = this.service.subCategories[event?.detail.to].id;
    await this.categoriesService.swapSubCat(from, subCatIdFrom, to, subCatIdTo);

    this.service.subCategories = event.detail.complete(
      this.service?.subCategories
    );
  }

  async doInnerOrder(event) {
    // new order of items

    const from =
      this.service.innerCategories[event?.detail.from].data.timestamp;
    const to = this.service.innerCategories[event?.detail.to].data.timestamp;
    const subCatIdFrom = this.service.innerCategories[event?.detail.from].id;
    const subCatIdTo = this.service.innerCategories[event?.detail.to].id;
    await this.categoriesService.swapInnerCat(
      from,
      subCatIdFrom,
      to,
      subCatIdTo
    );

    this.service.subCategories = event.detail.complete(
      this.service?.subCategories
    );
  }

  close() {
    this.modalService.dismiss().then(() => {
      this.service.category = {
        data: { category: "", products_count: 0, timestamp: "" },
        id: "",
      };
      this.service.subCategory = {
        data: { timestamp: "", category_id: "", sub_category: "" },
        id: "",
      };
      this.service.innerCategory = {
        id: "",
        data: { timestamp: "", inner_category: "", sub_category_id: "" },
      };
    });
  }
}
