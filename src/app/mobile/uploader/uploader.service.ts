import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { BehaviorSubject, finalize, lastValueFrom, map } from "rxjs";
import { LIVE_STREAMINGS, cloudinary_name } from "src/app/constants";
import { getTimestamp } from "src/app/services/functions/functions";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";

@Injectable({
  providedIn: "root",
})
export class UploaderService {
  public progress = new BehaviorSubject(0);
  public thumbUploaded = new BehaviorSubject(false);
  public uploadStarted = new BehaviorSubject(false);
  public uploadSuccess = new BehaviorSubject(false);
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient,
    private utilService: UtilityService,
    private screen: ScreenService
  ) {}

  public getId() {
    return this.firestore.createId();
  }

  public reset() {
    this.progress.next(0);
    this.thumbUploaded.next(false);
    this.uploadStarted.next(false);
  }

  public async saveVideoData(videoInfo: any, videoData: any, thumbFile: any) {
    this.uploadStarted.next(true);
    let tempProgress = 0;
    const formData = new FormData();
    formData.append("file", thumbFile);
    formData.append("upload_preset", "video_streaming");
    formData.append("quality", "80");
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`;

    const req = new HttpRequest("POST", uploadUrl, formData, {
      headers: new HttpHeaders(),
      reportProgress: true,
    });
    this.http
      .request(req)
      .pipe(
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            tempProgress = Math.round((100 * event.loaded) / event.total) * 0.2;
            this.progress.next(tempProgress);
          } else if (event.body && event.statusText === "OK") {
            return event.body;
          } else {
            return null;
          }
        })
      )
      .subscribe({
        next: (thumbResponse) => {
          if (thumbResponse) {
            const public_id = thumbResponse.public_id;
            const path =
              "streamings/videos/" + videoInfo.id + "/" + videoData.fileName;
            const fireUploader = this.storage.upload(path, videoData.file);

            fireUploader.percentageChanges().subscribe((value) => {
              this.progress.next(tempProgress + value * 0.8);
            });
            fireUploader
              .snapshotChanges()
              .pipe(
                finalize(async () => {
                  // videoInfo.public_id = result.info.public_id;
                  videoInfo.recorded = true;
                  videoInfo.live = false;
                  videoInfo.wasLive = false;
                  videoInfo.thumb = public_id;
                  videoInfo.fileList = [
                    {
                      fileName: path,
                    },
                  ];
                  videoInfo.timestamp = getTimestamp();
                  await this.firestore
                    .collection(LIVE_STREAMINGS)
                    .doc(videoInfo.id)
                    .set({ ...videoInfo, status: 1 })
                    .catch(async (err) => {
                      this.uploadStarted.next(false);
                      await this.utilService.showToast(
                        "Uploaded Failed",
                        "danger"
                      );
                    });
                  this.uploadSuccess.next(true);
                  await this.utilService.showToast(
                    "Uploaded successfully.",
                    "success"
                  );
                  this.uploadStarted.next(false);
                  this.screen.uploaderModal.next(false);
                })
              )
              .subscribe({
                error: async (err) => {
                  this.uploadStarted.next(false);
                  await this.utilService.showToast("Uploaded Failed", "danger");
                },
              });
          }
        },
        error: async (e) => {
          this.uploadStarted.next(false);
          await this.utilService.showToast("Uploaded Failed", "danger");
        },
        complete: () => console.info("complete"),
      });
  }
}
