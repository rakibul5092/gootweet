import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-message-text",
  templateUrl: "./message-text.component.html",
  styleUrls: ["./message-text.component.scss"],
})
export class MessageTextComponent implements OnInit {
  @Input() text: string;
  constructor() {}

  ngOnInit() {}
}
