import {Component, OnInit} from "@angular/core";
import {NavParams, PopoverController} from "@ionic/angular";

@Component({
  selector: "app-option",
  templateUrl: "./option.page.html",
  styleUrls: ["./option.page.scss"],
})
export class OptionPage implements OnInit {
  myUid: string;
  designerUid: string;
  vipOption: false;
  vip = false;
  constructor(
    private navParams: NavParams,
    private popover: PopoverController
  ) {}

  ngOnInit() {
    this.myUid = this.navParams.get("myUid");
    this.designerUid = this.navParams.get("designerUid");
    this.vipOption = this.navParams.get("vipOption");
    this.vip = this.navParams.get("vip");
  }

  changeVip(flag: boolean) {
    this.popover.dismiss({
      m_uid: this.myUid,
      d_uid: this.designerUid,
      vip: flag,
      remove: false,
    });
  }

  async removeDesigner() {
    this.popover.dismiss({
      m_uid: this.myUid,
      d_uid: this.designerUid,
      vip: false,
      remove: true,
    });
    return;
  }
}
