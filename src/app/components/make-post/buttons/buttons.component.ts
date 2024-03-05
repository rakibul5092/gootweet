import { Component, Input } from "@angular/core";
import { WallpostButtons } from "src/app/enums/enums";
import { WallPostData } from "src/app/models/wall-test";

@Component({
  selector: "app-buttons",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.scss"],
})
export class ButtonsComponent {
  @Input() wallPost: WallPostData;
  @Input() isManufacturer = false;
  buttons = WallpostButtons;
  constructor() {}
}
