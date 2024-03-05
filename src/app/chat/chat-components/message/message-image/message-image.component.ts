import { Component, Input, OnInit } from "@angular/core";
import { lazyImage } from "src/app/constants";
import { openPhoto } from "../../../../services/functions/functions";

@Component({
  selector: "app-message-image",
  templateUrl: "./message-image.component.html",
  styleUrls: ["./message-image.component.scss"],
})
export class MessageImageComponent implements OnInit {
  @Input() id: string;
  @Input() url: string;

  default = lazyImage;
  openPhoto = openPhoto;
  constructor() {}

  ngOnInit() {}
}
