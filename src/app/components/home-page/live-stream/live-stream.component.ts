import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LIVE_STREAMING_VIDEOS_BASE } from "src/app/constants";
import { LiveProduct } from "src/app/models/product";
import { Video } from "src/app/models/video";
import { LiveStreamingService } from "src/app/services/live-streaming.service";

@Component({
  selector: "app-live-stream",
  templateUrl: "./live-stream.component.html",
  styleUrls: ["./live-stream.component.scss"],
})
export class LiveStreamComponent implements OnInit, OnDestroy {
  @Input() buttonVisibility = true;
  autoplay = false;
  destroy$ = new Subject<boolean>();
  public video: any;
  public liveVideoBase = LIVE_STREAMING_VIDEOS_BASE;
  constructor(
    private nav: NavController,
    private liveStreamingService: LiveStreamingService
  ) {}

  ngOnInit() {
    this.liveStreamingService
      .getLastStreaming()
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        if (!query.empty) {
          this.video = query.docs[0].data();
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.autoplay = false;
  }
  gotoLiveStreams() {
    this.nav.navigateForward("all-live-stream");
  }
}
