import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LIVE_STREAMINGS_THUMBS_BASE } from "src/app/constants";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-gootweet-tube",
  templateUrl: "./gootweet-tube.page.html",
  styleUrls: ["./gootweet-tube.page.scss"],
})
export class GootweetTubePage implements OnInit, OnDestroy {
  public me: User;
  destroy$ = new Subject<boolean>();
  video$: Observable<LiveStream>;
  videos: LiveStream[];
  thumbBase = LIVE_STREAMINGS_THUMBS_BASE;
  constructor(
    private screen: ScreenService,
    private streamingService: LiveStreamingService,
    private loginService: LoginService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  ionViewWillEnter() {
    if (this.screen.width.value > 768) {
      this.screen.headerHide.next(false);
    } else {
      this.screen.headerHide.next(true);
    }
  }

  ionViewWillLeave() {
    this.screen.headerHide.next(false);
  }

  public onDelete(index: number) {
    this.videos.splice(index, 1);
  }

  async ngOnInit() {
    if (!this.streamingService.lastVideo.value) {
      this.streamingService.getLastStreaming();
    }
    this.me = await this.loginService.getUser();
    this.video$ = this.streamingService.lastVideo;
    this.streamingService.getVideoList().subscribe((res) => {
      this.videos = res;
    });
  }
}
