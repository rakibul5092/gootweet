import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { IonPopover, NavController } from "@ionic/angular";
import { forkJoin, lastValueFrom, switchMap } from "rxjs";
import { LIVE_STREAMINGS, LIVE_STREAMING_VIDEOS_BASE } from "src/app/constants";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-video-element",
  templateUrl: "./video-element.component.html",
  styleUrls: ["./video-element.component.scss"],
})
export class VideoElementComponent implements OnInit {
  @Input() video: LiveStream;
  @Input() me: User;
  @Output() onDelete = new EventEmitter();
  public duration = "";
  constructor(
    private nav: NavController,
    private screen: ScreenService,
    public gotoProfileService: GotoProfileService,
    public streamingService: LiveStreamingService,
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage
  ) {}

  ngOnInit() {
    const videoElement = document.createElement("video");
    const url = LIVE_STREAMING_VIDEOS_BASE + this.video.fileList[0].fileName;
    videoElement.src = url;
    videoElement.oncanplay = (ev) => {
      const minutes = Math.floor(videoElement.duration / 60);
      const seconds = Math.floor(videoElement.duration % 60);
      this.duration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
  }

  onNextPage(video: LiveStream = null) {
    let url = "";
    if (video) {
      this.streamingService.selectedVideo$.next(video);
      if (video.live || !video.wasLive) {
        url = "live-chat/" + video.id + "/3";
      } else {
        url = "/live-products/" + video.id;
      }
      if (this.screen.width.value > 768) {
        url = "/view-live/" + video.id;
      }
      this.nav.navigateForward(url, {
        animated: true,
        animationDirection: "forward",
      });
    }
  }

  public async delete(option: IonPopover) {
    await option.dismiss();
    await this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(this.video.id)
      .delete();
    const folder =
      LIVE_STREAMING_VIDEOS_BASE + "streamings/videos/" + this.video.id;

    await lastValueFrom(
      this.firestorage
        .refFromURL(folder)
        .listAll()
        .pipe(
          switchMap((result: any) => {
            const deletions = result.items.map((item: any) => item.delete());
            return forkJoin(deletions);
          })
        )
    )
      .then(async () => {
        this.onDelete.emit();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
