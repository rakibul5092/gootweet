import { Component, OnInit } from "@angular/core";
import { ReelsService } from "../reels.service";

@Component({
  selector: "app-reel-uploader",
  templateUrl: "./reel-uploader.component.html",
  styleUrls: ["./reel-uploader.component.scss"],
})
export class ReelUploaderComponent implements OnInit {
  public progress = 0;
  constructor(public reelService: ReelsService) {}

  ngOnInit() {}
}
