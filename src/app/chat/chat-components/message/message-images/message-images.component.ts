import { Component, Input, OnInit } from "@angular/core";
import { lazyImage } from "src/app/constants";
import { openPhotoFromArray } from "src/app/services/functions/functions";

@Component({
  selector: "app-message-images",
  templateUrl: "./message-images.component.html",
  styleUrls: ["./message-images.component.scss"],
})
export class MessageImagesComponent implements OnInit {
  @Input() images: string[];
  @Input() id: string;

  default = lazyImage;

  openPhotoFromArray = openPhotoFromArray;

  constructor() {}

  ngOnInit() {}
}
