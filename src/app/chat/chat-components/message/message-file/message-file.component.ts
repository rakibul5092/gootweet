import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-message-file",
  templateUrl: "./message-file.component.html",
  styleUrls: ["./message-file.component.scss"],
})
export class MessageFileComponent implements OnInit {
  @Input() mime: string;
  @Input() url: string;
  constructor() {}

  ngOnInit() {}
}
