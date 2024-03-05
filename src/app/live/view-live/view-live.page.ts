import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Subject, takeUntil } from "rxjs";
import {
  LIVE_STREAMING_VIDEOS_BASE,
  appId,
  lazyImage,
} from "src/app/constants";
import { LiveProduct } from "src/app/models/product";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";

@Component({
  selector: "app-view-live",
  templateUrl: "./view-live.page.html",
  styleUrls: ["./view-live.page.scss"],
})
export class ViewLivePage implements OnInit, OnDestroy {
  public liveVideo: LiveStream;
  public productVideoBase = LIVE_STREAMING_VIDEOS_BASE;
  public default = lazyImage;
  private destroy$ = new Subject<boolean>();
  public me: User;
  public height = 0;
  public liveProducts: LiveProduct[];
  private options = {
    // Pass your App ID here.
    appId: appId,
    // Set the channel name.
    channel: "",
    // Pass your temp token here.
    token: null,
    // Set the user ID.
    uid: "",
    // Set the user role
    role: "",
  };

  private channelParameters = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteVideoTrack: null,
    // A variable to hold the remote user id.s
    remoteUid: null,
  };
  private agoraEngine: any;
  public playerContainer: HTMLDivElement;
  constructor(
    public streamingService: LiveStreamingService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private screen: ScreenService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    if (this.screen.width.getValue() < 769) {
      this.router.navigate([
        "/live-chat/" + this.route.snapshot.params.id + "/3",
      ]);
    } else {
      this.route.params
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (res) => {
          if (res.id) {
            this.me = await this.loginService.getUser();
            this.screen.height.subscribe((value) => {
              this.height = value - 65;
            });
            this.playerContainer = document.getElementById(
              "live-player-container"
            ) as HTMLDivElement;

            this.streamingService
              .getVideoById(res.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe(async (videoRes) => {
                if (videoRes) {
                  this.liveVideo = videoRes;
                  if (this.liveVideo.live) {
                    this.options.role = "audience";

                    this.options.channel = res.id;
                    this.options.uid = this.streamingService.getFirebaseDocId();
                    this.agoraEngine = AgoraRTC.createClient({
                      mode: "live",
                      codec: "vp9",
                    });
                    await this.agoraEngine.setClientRole(this.options.role);

                    this.agoraEngine.on(
                      "user-published",
                      async (user, mediaType) => {
                        await this.agoraEngine.subscribe(user, mediaType);
                        // Retrieve the remote video track.
                        this.channelParameters.remoteVideoTrack =
                          user.videoTrack;
                        this.channelParameters.remoteAudioTrack =
                          user.audioTrack;

                        // Play the remote video track.
                        this.channelParameters.remoteVideoTrack?.play(
                          this.playerContainer
                        );
                        this.channelParameters.remoteAudioTrack?.play(
                          this.playerContainer
                        );
                        this.styleVideoPlayer();
                      }
                    );
                    await this.agoraEngine.join(
                      this.options.appId,
                      this.options.channel,
                      this.options.token,
                      this.options.uid
                    );
                  }
                }
              });
            this.streamingService
              .getLiveProductsByLiveId(res.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe((products) => {
                if (products) {
                  this.liveProducts = products;
                }
              });
            // await lastValueFrom(
            //   this.streamingService
            //     .getAllLastMessages(res.id)
            //     .pipe(takeUntil(this.destroy$))
            // ).then((messages) => {
            //   console.log("old message receive");

            //   this.messages = messages;
            //   this.messages.shift();
            // });
          }
        });
    }
  }

  private styleVideoPlayer() {
    const agoraContainer = this.playerContainer.firstChild as HTMLDivElement;
    agoraContainer.style.display = "flex";
    agoraContainer.style.justifyContent = "center";
    agoraContainer.style.alignItems = "center";
    const videoPlayer = agoraContainer.firstChild as HTMLVideoElement;
    if (videoPlayer) {
      videoPlayer.style.position = "unset";
      videoPlayer.style.height = "unset";
      videoPlayer.style.transform = "rotateY(180deg)";
    }
  }
}
