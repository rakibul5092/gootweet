import {Component, OnInit} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {ChatOutsideService} from "../chat-outside.service";

@Component({
  selector: "app-option",
  templateUrl: "./option.page.html",
  styleUrls: ["./option.page.scss"],
})
export class OptionPage implements OnInit {
  constructor(
    public service: ChatOutsideService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  block() {
    this.popoverController.dismiss().then(() => {
      this.service.blockAndRequestAgain();
    });
  }
}
