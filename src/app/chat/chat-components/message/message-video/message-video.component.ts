import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-message-video",
  templateUrl: "./message-video.component.html",
  styleUrls: ["./message-video.component.scss"],
})
export class MessageVideoComponent implements OnInit {
  @Input() videoUrl: string;
  constructor() {}

  ngOnInit() {}
}
