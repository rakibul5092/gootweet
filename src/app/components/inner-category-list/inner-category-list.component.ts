import { Component, Input, OnInit } from "@angular/core";
import { ItemReorderEventDetail, ModalController } from "@ionic/angular";
import { ProfileService } from "src/app/home-main/manufacturer/profile-test/profile.service";
import { User } from "src/app/models/user";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-inner-category-list",
  templateUrl: "./inner-category-list.component.html",
  styleUrls: ["./inner-category-list.component.scss"],
})
export class InnerCategoryListComponent implements OnInit {
  @Input() ownerUid: string;
  @Input() me: User;
  public arrange = false;
  innerCategories: any[];

  constructor(
    public profileService: ProfileService,
    private modalController: ModalController,
    private utils: UtilityService
  ) {}
  ngOnInit(): void {
    this.profileService.innerCategories.subscribe((innerCats) => {
      this.innerCategories = innerCats;
    });
  }

  async onSelectInnerCat(innerId: string, inner_category: string) {
    this.profileService.startAfter = null;
    if (
      innerId == this.profileService.selectedInnerCategoryId ||
      this.arrange
    ) {
      return;
    }
    this.profileService.selectedInnerCategory = inner_category;
    this.profileService.selectedInnerCategoryId = innerId;
    this.profileService.products = [];
    this.profileService.findProduct(this.ownerUid);
    await this.modalController?.dismiss();
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const from = ev.detail.from;
    const to = ev.detail.to;
    const inners = [...this.profileService.innerCategories.value, ...[]];
    const temp = inners.splice(from, 1);
    inners.splice(to, 0, temp[0]);

    inners.map((item, index) => {
      const serial = inners.length - index;
      item.serial = serial;
    });
    this.profileService.innerCategories.next(inners);
    ev.detail.complete();
  }

  async onSave() {
    await this.utils.present("Saving...");
    await this.profileService.onSaveInners();
    this.arrange = false;
    await this.utils.dismiss();
    await this.utils.showToast("Successful", "success");
  }
}
