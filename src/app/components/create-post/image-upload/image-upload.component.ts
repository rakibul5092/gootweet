import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Image } from "src/app/models/product";
import { wallpostFile } from "src/app/models/wall-test";
import { makeName } from "src/app/services/functions/functions";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  @Input() uid: string;
  @Output() onUploaded = new EventEmitter();
  constructor(private utils: UtilityService) {}

  ngOnInit() {}

  async onBrowseImage(event: any) {
    let tempFiles = event.target.files;

    const filesData = [];
    const files: { url: string; thumbName?: string; type: string }[] = [];
    for (let i = 0; i < tempFiles.length; i++) {
      if (tempFiles[i].size / 1000 / 1000 >= 100) {
        event.target.value = null; // Clear the file input
        await this.utils.showAlert(
          "Warning!",
          "Video galite ikelti tik mp4 formatu ir iki 100mb"
        );
        return;
      }
      const tempChunk = (tempFiles[i].name as string).split(".");
      const format = tempChunk[tempChunk.length - 1];
      const fileName = makeName(format, this.uid);
      const type = tempFiles[i].type.includes("image") ? "image" : "video";
      let tempFile = tempFiles[i];
      let thumbName = null;
      let thumbnail = null;
      if (type === "video") {
        thumbName = makeName("png", this.uid);
        thumbnail = await this.generateVideoThumbnail(tempFile);
      }

      let file: wallpostFile = {
        dataForView: tempFile,
        thumbName: thumbName,
        thumbnail: thumbnail,
        format: format,
        type: type,
        name: fileName,
      };
      filesData.push(file);
      files.push({ url: fileName, thumbName: thumbName, type: type });

      if (i === tempFiles.length - 1) {
        this.onUploaded.emit({ filesData, files });
      }
    }
    // (<HTMLInputElement>document.getElementById("browselogo")).value = "";
  }

  private generateVideoThumbnail = (file: any) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.currentTime = 1.5;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
  };
}
