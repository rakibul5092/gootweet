import { Component, Input, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { GotoProfileService } from "src/app/services/goto-profile.service";

@Component({
  selector: "app-profile-photo",
  templateUrl: "./profile-photo.component.html",
  styleUrls: ["./profile-photo.component.scss"],
})
export class ProfilePhotoComponent implements OnInit {
  @Input() user: User;
  @Input() isSlider = false;
  @Input() size = 72;
  @Input() style: string = "object-fit: cover;";
  @Input() nameVisible = false;
  @Input() profileText: string;
  @Input() verified = false;
  @Input() nameWidth: string;
  @Input() convertedTime: string = "";
  @Input() disabled = false;
  @Input() statusVisible = true;
  @Input() ratingVisible = true;
  @Input() verifyIcon = "assets/img/verified-w.svg";
  constructor(
    private gotoProfileService: GotoProfileService,
    private menuController: MenuController
  ) {}

  ngOnInit() {}

  gotoProfile() {
    this.menuController?.close();
    if (this.user && !this.disabled)
      this.gotoProfileService.gotoProfile(this.user);
  }
}
