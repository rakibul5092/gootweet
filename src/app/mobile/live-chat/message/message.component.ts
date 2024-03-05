import { Component, Input } from "@angular/core";
import { LIVE_STREAMINGS_PRODUCT_PHOTO_BASE } from "src/app/constants";
import { LiveMessage } from "src/app/models/message";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
})
export class MessageComponent {
  @Input() message: LiveMessage;
  @Input() atTop: boolean;
  @Input() index: number;
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;
}
