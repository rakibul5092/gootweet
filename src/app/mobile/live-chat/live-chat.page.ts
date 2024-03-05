import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  LIVE_STREAMINGS,
  LIVE_STREAMING_VIDEOS_BASE,
  appId,
} from "src/app/constants";
import { LiveMessage } from "src/app/models/message";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";
import { LiveVideoStreamService } from "./live-video-stream.service";

@Component({
  selector: "app-live-chat",
  templateUrl: "./live-chat.page.html",
  styleUrls: ["./live-chat.page.scss"],
})
export class LiveChatPage implements OnInit, OnDestroy {
  public video$: BehaviorSubject<LiveStream> = new BehaviorSubject(undefined);
  private destroy$ = new Subject();
  public videoBase = LIVE_STREAMING_VIDEOS_BASE;
  public liveId = "";
  public me: User;
  public isSelfLive = new BehaviorSubject<boolean>(false);
  public liveType = new BehaviorSubject<string>("0");
  public messages: LiveMessage[] = [];
  public isLiveStarted = false;
  public modal = false;
  public cams: MediaDeviceInfo[] = [];
  public cameraSwitched = false;
  public liveInfo = {
    imageForView: null,
    imageFile: null,
    about: "",
    name: "",
  };
  public isAtTop = true;
  private isLive = true;
  constructor(
    public screen: ScreenService,
    public streamingService: LiveStreamingService,
    public liveVideoStreamingService: LiveVideoStreamService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private nav: NavController,
    private firestore: AngularFirestore,
    private utils: UtilityService,
    private router: Router
  ) {}
  public onMessageScroll(event) {
    const divElement = event.target;
    if (divElement) {
      this.isAtTop = divElement.scrollTop > -30;
    }
  }
  async ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$?.unsubscribe();
    await this.agoraEngine?.leave();
  }

  ionViewWillEnter() {
    this.screen.fullScreen.next(true);
  }

  ionViewDidEnter = () => {
    if (this.screen.width.getValue() > 769) {
      this.modal = false;
      this.router.navigate(["/view-live/" + this.route.snapshot.params.id]);
    }
  };

  ionViewWillLeave() {
    this.screen.fullScreen.next(false);
    if (this.liveType.value !== "2") {
      this.clean();
      this.isLiveStarted = false;
    }
  }
  public onBack(modal) {
    modal?.dismiss();
    setTimeout(() => {
      this.clean();
      if (this.isLive) {
        this.nav.navigateBack("/", {
          animated: true,
          animationDirection: "back",
        });
      }
    }, 500);
  }
  private clean() {
    this.modal = false;
    if (this.isLiveStarted) {
      this.isLiveStarted = false;
      this.liveVideoStreamingService.stopReording();
    }
    this.agoraEngine?.leave();
    if (this.playerContainer) {
      while (this.playerContainer.firstChild) {
        this.playerContainer.removeChild(this.playerContainer.firstChild);
      }
    }
    this.channelParameters.localAudioTrack?.close();
    this.channelParameters.localVideoTrack?.close();
  }

  ngOnInit() {
    this.load();
  }

  options = {
    // Pass your App ID here.
    appId: appId,
    // Set the channel name.
    channel: this.liveId,
    // Pass your temp token here.
    token: null,
    // Set the user ID.
    uid: "",
    // Set the user role
    role: null,
  };

  channelParameters = {
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
  agoraEngine: IAgoraRTCClient;
  playerContainer: HTMLDivElement;
  private async initCamera(isSelfLive: boolean, liveType: string) {
    this.playerContainer = document.getElementById(
      "player-container"
    ) as HTMLDivElement;

    if (isSelfLive === true && liveType === "1") {
      // this.stream = await getStream();

      this.options.role = "host";
      // Create a local audio track from the audio sampled by a microphone.
      this.channelParameters.localAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      this.channelParameters.localVideoTrack =
        await AgoraRTC.createCameraVideoTrack();
      // Play the local video track.
      this.channelParameters.localVideoTrack.play(this.playerContainer);
      this.styleVideoPlayer();
    } else if (liveType === "2" || liveType === "3") {
      this.firestore
        .collection(LIVE_STREAMINGS)
        .doc(this.liveId)
        .get()
        .subscribe(async (query) => {
          this.options.role = "audience";
          const data = query.data() as any;
          if (data && data.live) {
            this.options.channel = this.liveId;
            this.options.uid = this.firestore.createId();
            this.agoraEngine = AgoraRTC.createClient({
              mode: "live",
              codec: "vp8",
            });
            await this.agoraEngine.setClientRole(this.options.role);

            this.agoraEngine.on("user-published", async (user, mediaType) => {
              await this.agoraEngine.subscribe(user, mediaType);

              // Retrieve the remote video track.
              this.channelParameters.remoteVideoTrack = user.videoTrack;
              this.channelParameters.remoteAudioTrack = user.audioTrack;

              // Play the remote video track.
              this.channelParameters.remoteAudioTrack?.play(
                this.playerContainer
              );
              this.channelParameters.remoteVideoTrack?.play(
                this.playerContainer
              );
              this.styleVideoPlayer();
            });
            await this.agoraEngine.join(
              this.options.appId,
              this.options.channel,
              this.options.token,
              this.options.uid
            );

            // this.videoPlayer.nativeElement.src = data.videoUrl;
          } else if (data) {
            if (
              !data.live &&
              data.recorded &&
              data.fileList &&
              data.fileList.length > 0
            ) {
              this.isLive = false;
              const videoPlayer = document.createElement("video");
              videoPlayer.src =
                LIVE_STREAMING_VIDEOS_BASE + data.fileList[0].fileName;
              videoPlayer.autoplay = true;
              videoPlayer.controls = false;
              videoPlayer.style.width = "100%";
              videoPlayer.style.height = "unset";
              this.playerContainer.appendChild(videoPlayer);
            }
          }
        });
    }
  }

  private styleVideoPlayer() {
    const agoraContainer = this.playerContainer.firstChild as HTMLDivElement;
    if (agoraContainer) {
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

  public async startLiveVideo() {
    this.isLiveStarted = true;
    this.options.channel = this.liveId;
    this.options.uid = this.me.uid;
    if (
      this.options.role === "host" &&
      this.channelParameters.localVideoTrack
    ) {
      this.agoraEngine = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });
      await this.agoraEngine.setClientRole(this.options.role);
      const res = await this.agoraEngine.join(
        this.options.appId,
        this.options.channel,
        this.options.token,
        this.options.uid
      );
      await this.agoraEngine.publish([
        this.channelParameters.localAudioTrack,
        this.channelParameters.localVideoTrack,
      ]);
      // this.channelParameters?.remoteVideoTrack.stop();
      await this.liveVideoStreamingService
        .recordingAcquire()
        .then(async (res) => {
          console.log(res);

          if (res) {
            await this.liveVideoStreamingService.uploadStreamData(
              this.liveId,
              this.options.channel,
              this.liveInfo.about,
              res
            );
            this.liveVideoStreamingService.loaded = true;
          } else {
            this.agoraEngine?.leave;
            await this.utils.showAlert("Error", "Error making live.");
          }
        })
        .catch(async () => {
          this.isLiveStarted = false;
          this.liveVideoStreamingService.loaded = true;
          await this.agoraEngine?.leave;
          await this.utils.showAlert("Error", "Error making live.");
        });
    }
  }

  public async switchCamera() {
    if (this.cams.length > 0) {
      const videoTrackLabel =
        this.channelParameters.localVideoTrack.getTrackLabel();
      const currentCams = this.cams.filter(
        (cam) => cam.label !== videoTrackLabel
      );
      if (currentCams && currentCams.length > 0) {
        await this.channelParameters.localVideoTrack.setDevice(
          currentCams[0].deviceId
        );
        this.cameraSwitched = !this.cameraSwitched;
      }
    }
  }

  private async load() {
    this.me = await this.loginService.getUser();
    this.cams = await AgoraRTC.getCameras();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (!this.video$.getValue() && res.id && res.type) {
        this.liveId = res.id;
        this.liveType.next(res.type);
        this.modal = res.type === "1";
        this.liveVideoStreamingService.generateRecordingUid(this.liveId);
        this.streamingService
          .getVideoById(this.liveId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((apiRes) => {
            this.video$.next(apiRes);
            const selfLive = this.checkStreamOwner(apiRes, this.me);
            this.isSelfLive.next(selfLive);
            this.initCamera(selfLive, res.type);
          });

        this.streamingService
          .subscribeToLiveMessages(this.liveId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((lastMessage) => {
            this.messages = lastMessage;
          });
      }
    });
    // if (this.streamingService.selectedVideo$.value) {
    //   this.streamingService.selectedVideo$
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((res) => {
    //       this.video$.next(res);
    //       this.isSelfLive.next(this.checkStreamOwner(res, this.me));
    //     });
  }

  private checkStreamOwner(data: LiveStream, me: User): boolean {
    if (data) {
      return me ? (me.uid === data.uid ? true : false) : false;
    } else {
      return true;
    }
  }

  public messageText = "";
  public async onSendMessage() {
    if (this.messageText && this.messageText.length > 0) {
      const tempMessage = this.messageText.trim();
      this.messageText = "";
      await this.streamingService.sendMessage(
        tempMessage,
        this.liveId,
        this.me
      );
    }
  }

  public onCreateLiveProducts() {
    this.nav.navigateForward(
      "/create-live/" + this.liveId + "/" + this.liveType.value,
      { animated: true, animationDirection: "forward" }
    );
  }

  savingInProgress = false;
  async onSave() {
    if (this.liveInfo.about.trim() === "") {
      await this.utils.showAlert("Details missing!", "Please insert title.");
      return;
    }
    this.savingInProgress = true;
    await this.liveVideoStreamingService
      .saveLiveData(this.liveInfo, this.liveId)
      .then(() => {
        this.modal = false;
      })
      .catch(
        async (err) =>
          await this.utils.showAlert("Alert", "Failed! please try again.")
      );
  }

  public onBrowseImage(event) {
    let files = event.target.files;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let imageData = e.target.result;
      const ext = imageFile.name.split(".").pop();
      const imageName = this.liveId + "." + ext;
      this.liveInfo.imageForView = imageData;
      this.liveInfo.imageFile = imageFile;
      this.liveInfo.name = imageName;
    };
    reader.readAsDataURL(imageFile);

    (<HTMLInputElement>document.getElementById("liveImage")).value = "";
  }
}
