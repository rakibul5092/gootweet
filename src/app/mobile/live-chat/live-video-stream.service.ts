import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NavController } from "@ionic/angular";
import { lastValueFrom } from "rxjs";
import { LIVE_STREAMINGS, appId, cloudinary_name } from "src/app/constants";
import { UtilityService } from "src/app/services/utility.service";

interface AcquireResponse {
  cname: string;
  uid: string;
  resourceId: string;
  sid: string;
}
interface File {
  fileName: string;
  isPlayable: boolean;
  mixedAllUser: boolean;
  sliceStartTime: any;
  trackType: string;
  uid: string;
}
interface StopResponse extends AcquireResponse {
  serverResponse: {
    fileListMode: string;
    fileList: File[];
    uploadingStatus: string;
  };
}
@Injectable({
  providedIn: "root",
})
export class LiveVideoStreamService {
  public loaded = true;
  private recordingUid = "";
  private resourceId = "";
  private sid = "";
  private channelName = "";

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private utils: UtilityService,
    private storage: AngularFireStorage,
    private nav: NavController
  ) {}

  public async recordingAcquire() {
    this.loaded = false;
    const acquireUrl = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`;
    const body = {
      cname: this.channelName,
      uid: this.recordingUid,
      clientRequest: {},
    };
    const res = await lastValueFrom(
      this.http.post<AcquireResponse>(acquireUrl, body)
    ).catch(async (err) => {
      this.loaded = true;
      await this.utils.showAlert(
        "Error in acquire recording.",
        "There is a problem in live creating"
      );
    });

    if (res && res.resourceId) {
      this.resourceId = res.resourceId;
      const startUrl = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${this.resourceId}/mode/mix/start`;
      const startBody = {
        cname: res.cname,
        uid: res.uid,
        clientRequest: {
          token: "",
          recordingConfig: {
            channelType: 1,
            streamTypes: 2,
            videoStreamType: 0,
            maxIdleTime: 120,
            subscribeVideoUids: ["#allstream#"],
            subscribeAudioUids: ["#allstream#"],
            subscribeUidGroup: 0,
          },
          recordingFileConfig: {
            avFileType: ["hls", "mp4"],
          },
          storageConfig: {
            vendor: 6,
            region: 5,
            bucket: "furniin-d393f.appspot.com",
            accessKey: "GOOGZFPOFST33AD544AVFAC5",
            secretKey: "jyorLblfKSxcMwx/QbNCqUz1EIJAJN3ypG95jvvD",
            fileNamePrefix: ["streamings", "videos", this.channelName],
          },
        },
      };
      const startResponse = await lastValueFrom(
        this.http.post<any>(startUrl, startBody)
      ).catch(async (err) => {
        this.loaded = true;
        await this.utils.showAlert(
          "Error in start recording.",
          "There is a problem in live creating"
        );
      });
      if (startResponse) {
        this.sid = startResponse.sid;
        return this.sid;
      }
    } else {
      this.nav.navigateBack("/", {
        animated: true,
        animationDirection: "back",
      });
    }
  }

  public async stopReording() {
    this.loaded = false;
    const stopUrl = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${this.resourceId}/sid/${this.sid}/mode/mix/stop`;
    const body = {
      cname: this.channelName,
      uid: this.recordingUid,
      clientRequest: {},
    };
    const res = await lastValueFrom(
      this.http.post<StopResponse>(stopUrl, body)
    ).catch(async (err) => {
      this.loaded = true;
      await this.utils.showAlert(
        "Error in stop recording.",
        "There is a problem in in recording."
      );
    });

    if (res && res?.serverResponse?.fileList) {
      await this.firestore
        .collection(LIVE_STREAMINGS)
        .doc(this.channelName)
        .set(
          {
            fileList: res.serverResponse.fileList,
            live: false,
            recorded: true,
          },
          { merge: true }
        );
      this.loaded = true;
    } else {
      await this.firestore
        .collection(LIVE_STREAMINGS)
        .doc(this.channelName)
        .set(
          {
            live: false,
            recorded: false,
          },
          { merge: true }
        );
    }
  }

  public generateRecordingUid(channelname: string) {
    const random = Math.floor(Math.random() * 10000);
    const date = Date.now();
    this.recordingUid = (date / random).toFixed(0);
    this.channelName = channelname;
  }

  public async saveLiveData(imageData, id: string) {
    const formData = new FormData();
    formData.append("file", imageData.imageFile);
    formData.append("upload_preset", "video_streaming");
    formData.append("public_id", `${id}`);
    formData.append("quality", "80");
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`;

    const req = new HttpRequest("POST", uploadUrl, formData, {
      headers: new HttpHeaders(),
    });
    await lastValueFrom(this.http.request(req));
  }

  public async uploadStreamData(
    liveId: string,
    channelName: string,
    about: string,
    sid: string
  ) {
    await this.firestore
      .collection(LIVE_STREAMINGS)
      .doc(liveId)
      .set(
        {
          live: true,
          channel_name: channelName,
          sid: sid,
          thumb: "live_streamings_thumb/" + liveId,
          status: 2,
          about: about,
          recorded: false,
          wasLive: true,
        },
        { merge: true }
      );
  }

  // public async uploadVideoStream(blob: any, liveId: string) {
  //   const storageRef = this.fireStorage.ref("live_streams/videos/" + liveId);
  //   return storageRef.put(blob, {}).then(() => {
  //     return storageRef.getDownloadURL();
  //   });
  // }

  public getAvailableVideoInputs(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return Promise.reject("enumerateDevices() not supported.");
    }
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices: MediaDeviceInfo[]) => {
          resolve(
            devices.filter(
              (device: MediaDeviceInfo) => device.kind === "videoinput"
            )
          );
        })
        .catch((err) => {
          reject(err.message || err);
        });
    });
  }
}
