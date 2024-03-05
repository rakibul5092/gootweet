import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ChatRequest } from "src/app/models/chat-request";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.scss"],
})
export class RequestComponent implements OnInit {
  @Input() request: ChatRequest;
  @Output() onAccept: EventEmitter<ChatRequest> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();
  constructor(private router: Router) {}

  ngOnInit() {}
  navigateToManufacturerCatalog(manufacturerUid: string) {
    this.router.navigate([`profile/manufacturer/${manufacturerUid}/catalog`]);
  }
  requestAccept() {
    this.onAccept.emit(this.request);
  }
  cancelRequest() {
    this.onCancel.emit(this.request.data.user?.uid);
  }
}
