import { Component, Input, OnInit } from "@angular/core";
import { IonModal, ModalController } from "@ionic/angular";
import { User } from "src/app/models/user";
import { LiveStream } from "src/app/models/video.model";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { UploaderService } from "./uploader.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.page.html",
  styleUrls: ["./uploader.page.scss"],
})
export class UploaderPage implements OnInit {
  @Input() modal = false;
  private me: User;
  private videoId: string;
  public savingInProgress = false;
  public videoInfo: Partial<LiveStream> = {
    id: "",
    about: "",
    public_id: "",
  };
  public videoFile = {
    fileName: "",
    file: null,
    uri: null,
  };
  public videoThumb = {
    imageData: null,
    imageFile: null,
  };
  public uploader: any;
  public minimized = false;
  public uploadPercentage = 0;
  public uploadStarted = false;
  public progress = 0;

  constructor(
    private screen: ScreenService,
    private loginService: LoginService,
    public uploadService: UploaderService,
    private modalController: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.uploadService.uploadStarted.subscribe((value) => {
      this.uploadStarted = value;
    });
    this.uploadService.progress.subscribe((value) => {
      this.progress = value / 100;
    });
    this.uploadService.uploadSuccess.subscribe((value) => {
      if (value) {
        this.close();
      }
    });
  }
  public async onMinimize(modal: IonModal) {
    this.minimized = true;
  }

  public onMaximize(modal: IonModal) {
    modal.setCurrentBreakpoint(0.85);
    this.minimized = false;
  }

  public async close() {
    this.videoId = "";
    this.minimized = false;
    this.videoInfo = {
      id: "",
      about: "",
      public_id: "",
    };
    this.videoFile = {
      fileName: "",
      file: null,
      uri: null,
    };
    this.videoThumb = {
      imageData: null,
      imageFile: null,
    };
    this.uploadService.reset();
    await this.modalController.dismiss();
    this.screen.uploaderModal.next(false);
  }

  public onBrowseVideo(event) {
    if (!this.videoId || this.videoId === "") {
      this.videoId = this.uploadService.getId();
    }
    let files = event.target.files;
    this.videoFile.file = files[0];
    this.videoFile.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(files[0])
    );
    const ext = this.videoFile.file.name.split(".").pop();
    this.videoFile.fileName = this.videoId + "." + ext;
    (<HTMLInputElement>document.getElementById("recordedVideo")).value = "";
  }

  public onBrowseVideoThumb(event) {
    let files = event.target.files;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let imageData = e.target.result;
      const ext = imageFile.name.split(".").pop();
      this.videoThumb.imageData = imageData;
      this.videoThumb.imageFile = imageFile;
    };
    reader.readAsDataURL(imageFile);

    (<HTMLInputElement>document.getElementById("recordedVideothumb")).value =
      "";
  }

  public async onSave() {
    this.me = await this.loginService.getUser();
    this.minimized = true;
    this.videoInfo.owner = this.me;
    this.videoInfo.id = this.videoId;
    this.videoInfo.uid = this.me.uid;

    this.uploadService.saveVideoData(
      this.videoInfo,
      this.videoFile,
      this.videoThumb.imageFile
    );
  }
}
