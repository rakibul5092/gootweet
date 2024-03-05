import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-my-lives",
  templateUrl: "./my-lives.page.html",
  styleUrls: ["./my-lives.page.scss"],
})
export class MyLivesPage implements OnInit {
  public me: User;
  public isWeb = true;
  public ownerUid = "";
  public videos: LiveStream[];
  constructor(
    private nav: NavController,
    private loginService: LoginService,
    private router: Router,
    public streamingService: LiveStreamingService
  ) {}

  async ngOnInit() {
    this.ownerUid = this.router.url.split("/")[3];
    this.me = await this.loginService.getUser();
    if (this.ownerUid) {
      this.streamingService
        .getVideoListByUID(this.ownerUid)
        .subscribe((res) => {
          this.videos = res;
        });
    }
  }

  public onDelete(index: number) {
    this.videos.splice(index, 1);
  }
}
