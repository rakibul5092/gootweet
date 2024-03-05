import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ScreenService } from "src/app/services/screen.service";
import { ChatsService } from "../../chats/chats.service";
import { User } from "../../models/user";
import { LoginService } from "../../services/login.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.page.html",
  styleUrls: ["./user-settings.page.scss"],
})
export class UserSettingsPage implements OnInit {
  selectedTab = 1;
  user: User;
  constructor(
    private storage: LoginService,
    private nav: NavController,
    private utilService: UtilityService,
    private chatsService: ChatsService,
    public screen: ScreenService
  ) {}

  async ngOnInit() {
    this.user = await this.storage.getUser();
  }

  async logout() {
    await this.utilService.present("Atsijungti...");
    this.chatsService.ngOnDestroy();
    await this.storage.signOut().then(async () => {
      await this.utilService.dismiss();
      this.nav.navigateRoot("login");
    });
  }
}
