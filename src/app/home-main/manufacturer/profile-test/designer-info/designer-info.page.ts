import { Component, Input, OnInit } from "@angular/core";
import { users } from "../../../../constants";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DesignerManufacturerAlphabeticallyService } from "../../../../home-designer/designer-manufacturer-alphabetically/designer-manufacturer-alphabetically.service";
import { GotoProfileService } from "../../../../services/goto-profile.service";
import { Designer } from "../../../../models/user";

@Component({
  selector: "app-designer-info",
  templateUrl: "./designer-info.page.html",
  styleUrls: ["./designer-info.page.scss"],
})
export class DesignerInfoPage implements OnInit {
  @Input() productOwner: Designer;
  @Input() isDesigner: boolean = true;
  editAbout: boolean = false;

  constructor(
    private angularFirestore: AngularFirestore,
    private gotoProfileService: GotoProfileService,
    public designerManufacturerAlphabeticallyService: DesignerManufacturerAlphabeticallyService
  ) {}

  ngOnInit() {}

  saveAbout() {
    this.editAbout = false;
    this.angularFirestore
      .collection(users)
      .doc(this.productOwner.uid)
      .set({ about: this.productOwner.about }, { merge: true })
      .then((r) => {});
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
}
