import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { NgxImageCompressService } from "ngx-image-compress";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { UtilityService } from "./utility.service";
import { filter, first, map, switchMap } from "rxjs/operators";
import { wallpostFile } from "../models/wall-test";
import { Observable, combineLatest, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AwsUploadService {
  constructor(
    private http: HttpClient,
    // private imageCompress: NgxImageCompressService,
    private storage: AngularFireStorage,
    private util: UtilityService
  ) {}
  // 94.23.249.99
  // async compressFile(image: any): Promise<any> {
  //   this.imageCompress.uploadFile()
  //   return await this.imageCompress.compressFile(image, ).then((result) => {
  //     return result;
  //   });
  // }

  getGraphAccessToken() {}

  getMetaTags(url: string) {
    let data = {
      scrape: true,
      id: url,
    };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer 3094531267471874|VjrMsuyfoWlA98tTmn6cOsVyqkA`,
    });
    return this.http
      .post("https://graph.facebook.com/v13.0", data, { headers: headers })
      .pipe(
        first(),
        map((action: any) => {
          if (action.image && action.image.length > 0) {
            return { ...action, image: action.image[0].url };
          }
          return action;
        })
      );
  }

  dataURLtoFile(dataurl: any, filename: string, mime: string) {
    var arr = dataurl.split(","),
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  removeImages(folder: string, files: string[]) {
    files.forEach((item) => {
      this.storage.ref(folder + "/" + item).delete();
    });
  }

  async uploadMultipleFiles(files: wallpostFile[], folder: string) {
    const promises = [];
    files.forEach(async (file) => {
      if (file.type === "video") {
        const thumbPath = `${folder}/${file.thumbName}`;
        let base64 = file.thumbnail.split(",")[1];
        const thumbTask = this.storage
          .ref(thumbPath)
          .putString(base64, "base64", { contentType: "image/png" });
        promises.push(thumbTask);
      }
      const filePath = `${folder}/${file.name}`;
      const task = this.storage.upload(filePath, file.dataForView);
      promises.push(task);
      this.util.setLoadingText("Uploading please wait...");
    });
    return Promise.all(promises);
  }

  async uploadImage(
    folder: string,
    fileName: string,
    data: any,
    isVideo = false
  ) {
    if (isVideo) {
      const videoUploader = this.storage.upload(folder + "/" + fileName, data);
      videoUploader
        .percentageChanges()
        .pipe(first())
        .subscribe((percentage) => {
          this.util.setLoadingText(
            "Uploading.." + " (" + percentage.toFixed(2) + ")%"
          );
        });
      return await videoUploader;
    } else {
      let base64 = data.split(",")[1];
      return await this.storage
        .ref(folder + "/" + fileName)
        .putString(base64, "base64", { contentType: "image/webp" });
      // return this.http.post(URL, postData);
    }
  }
}
