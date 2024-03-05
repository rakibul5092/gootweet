import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { ProfileService } from "src/app/home-main/manufacturer/profile-test/profile.service";

@Component({
  selector: "app-bottom-subcat-modal",
  templateUrl: "./bottom-subcat-modal.page.html",
  styleUrls: ["./bottom-subcat-modal.page.scss"],
})
export class BottomSubcatModalPage implements OnInit {
  ownerUid: string;
  innerCategories: any[];
  constructor(
    public profileService: ProfileService,
    private navParams: NavParams,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    if (this.navParams && this.navParams.get("owner_uid")) {
      this.ownerUid = this.navParams.get("owner_uid");
      this.profileService.innerCategories.next([]);
      this.profileService.getInnerCategories(this.ownerUid);
      this.profileService.innerCategories.subscribe((innerCats) => {
        this.innerCategories = innerCats;
      });
    }
  }
  close() {
    this.modalController.dismiss();
  }
  onSelectSubCat(subCatId: string) {
    if (this.ownerUid && this.ownerUid != "") {
      this.profileService.startAfter = null;
      if (subCatId == this.profileService.selectedInnerCategoryId) {
        return;
      }
      this.profileService.selectedInnerCategoryId = subCatId;
      this.profileService.products = [];
      this.profileService.findProduct(this.ownerUid);
      this.close();
    }
  }
}
