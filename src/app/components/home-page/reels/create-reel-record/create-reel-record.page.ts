import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Subscription, interval } from "rxjs";
import { LiveVideoStreamService } from "src/app/mobile/live-chat/live-video-stream.service";
import { User } from "src/app/models/user";
import { captureThumb } from "src/app/services/functions/functions";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";
import { ReelsService } from "../reels.service";
@Component({
  selector: "app-create-reel-record",
  templateUrl: "./create-reel-record.page.html",
  styleUrls: ["./create-reel-record.page.scss"],
})
export class CreateReelRecordPage implements OnInit {
  public recordStarted = false;
  public recorded = false;
  public seconds = 0;
  public minutes = 0;
  public about = "";
  public videoUrl = "";
  public thumbUrl = "";
  public file: any;
  public mediaDevices: MediaDeviceInfo[] = [];
  public fileSelected = false;
  private me: User;
  private stream: MediaStream;
  private chunks = [];
  private countDownSubs: Subscription;
  private videoPlayer: HTMLVideoElement;
  private mediaRecorder: MediaRecorder;
  private selectedCameraIndex = 0;

  constructor(
    private videoStreamService: LiveVideoStreamService,
    private screen: ScreenService,
    public reelsService: ReelsService,
    private loginService: LoginService,
    private nav: NavController,
    private cdr: ChangeDetectorRef,
    private utils: UtilityService
  ) {}

  ionViewWillEnter = () => this.screen.fullScreen.next(true);
  ionViewWillLeave = () => this.screen.fullScreen.next(false);
  async ngOnInit() {
    this.me = await this.loginService.getUser();
    this.initVideoInputs();
  }

  private initVideoInputs() {
    this.detectAvailableDevices().then((devices: any) => {
      this.mediaDevices = devices;
      this.startCamera(this.mediaDevices[this.selectedCameraIndex].deviceId);
    });
  }

  public async saveReel() {
    const videoBlob = new Blob(this.chunks, { type: "video/mp4" });
    const fileSize = this.file
      ? this.file.size / 1000000
      : videoBlob.size / 1000000;
    if (fileSize > 300) {
      await this.utils.showAlert(
        "Limit exceeded",
        "Please select video below 300MB."
      );
      return;
    }

    this.reelsService.cloudinaryUpload(
      this.file ? this.file : videoBlob,
      this.me,
      this.about
    );
    this.nav.back({ animated: true, animationDirection: "back" });
  }

  public startRecording() {
    this.mediaRecorder.start();
    this.thumbUrl = captureThumb(this.videoPlayer).toDataURL("image/png");
    this.recordStarted = true;
    this.countDown();
  }

  public stopRecording() {
    this.mediaRecorder?.stop();
    this.recorded = true;
    // this.stream?.getTracks().forEach((track) => track?.stop());
    this.recordStarted = false;
    this.countDownSubs?.unsubscribe();
  }

  public restart() {
    this.minutes = 0;
    this.seconds = 0;
    this.recorded = false;
    this.recordStarted = false;
    this.fileSelected = false;
    this.file = null;
    this.initVideoInputs();
    // this.stream?.getTracks().forEach((track) => track?.stop());
  }

  private countDown() {
    this.countDownSubs = interval(1000).subscribe(() => {
      if (this.seconds === 59) {
        // Decrease the minutes and set seconds to 59
        this.minutes++;
        this.seconds = 0;
      } else {
        // Decrease the seconds
        this.seconds++;
      }
    });
  }

  public async onFileSelection(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.target.files;
    this.stopCamera();
    this.stopRecording();
    this.fileSelected = true;

    this.file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = async (e: any) => {
      const videoPlayer = document.getElementById(
        "fileVideo"
      ) as HTMLVideoElement;
      if (videoPlayer) {
        videoPlayer.src = e.target.result;
        videoPlayer.currentTime = 1;
        videoPlayer.muted = true;
        videoPlayer.load();
        videoPlayer.play();
        videoPlayer.addEventListener("canplay", () => {
          this.thumbUrl = captureThumb(videoPlayer).toDataURL("image/png");
          this.recorded = true;
          this.recordStarted = false;
          videoPlayer.pause();
        });
      }
    };
    fileReader.readAsDataURL(this.file);
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  switchCamera(): void {
    this.selectedCameraIndex = this.selectedCameraIndex === 0 ? 1 : 0;
    const deviceId = this.mediaDevices[this.selectedCameraIndex].deviceId;
    this.stopCamera();
    setTimeout(() => {
      this.startCamera(deviceId);
    }, 2000);
    this.cdr.detectChanges();
  }

  facingMode = "environment";
  startCamera(deviceId: string): void {
    this.facingMode = this.facingMode === "user" ? "environment" : "user";
    const constraints: MediaStreamConstraints = {
      video: { facingMode: this.facingMode },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        this.stream = stream;
        this.videoPlayer = document.getElementById(
          "cameraFotage"
        ) as HTMLVideoElement;
        this.videoPlayer.srcObject = this.stream;
        this.videoPlayer.play();

        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          }
        });
        this.mediaRecorder.addEventListener("stop", () => {});
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }

  private detectAvailableDevices(): Promise<MediaDeviceInfo[]> {
    return new Promise((resolve, reject) => {
      this.videoStreamService
        .getAvailableVideoInputs()
        .then((devices: MediaDeviceInfo[]) => {
          resolve(devices);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
