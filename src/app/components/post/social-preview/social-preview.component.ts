import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-social-preview",
  templateUrl: "./social-preview.component.html",
  styleUrls: ["./social-preview.component.scss"],
})
export class SocialPreviewComponent implements OnInit {
  @Input() img: string;
  @Input() title: string;
  @Input() description: string;
  @Input() url: string;
  @Input() siteName: string
  shortened = false;
  constructor() { }

  ngOnInit() {
    this.shortened = this.description.length > 60
  }
}
