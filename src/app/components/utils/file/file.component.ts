import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { WALLPOST_FILE_BASE, lazyImage } from "src/app/constants";
import { wallpostFile } from "src/app/models/wall-test";
import { openPhoto } from "src/app/services/functions/functions";

@Component({
  selector: "app-file",
  templateUrl: "./file.component.html",
  styleUrls: ["./file.component.scss"],
})
export class FileComponent implements OnInit {
  @Input() file: wallpostFile;
  @Input() class = "cover";
  @Input() wallId: string = "1234";
  @Input() isLive = true;
  @Input() controls = true;
  @Input() isLiveVideo = false;
  public default = lazyImage;
  public openPhoto = openPhoto;
  public thumnailUrl = "";
  constructor() {}

  ngOnInit() {
    this.thumnailUrl =
      WALLPOST_FILE_BASE + this.wallId + "/" + this.file.thumbName;
  }
}
