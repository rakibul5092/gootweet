import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-delivery-info",
  templateUrl: "./delivery-info.component.html",
  styleUrls: ["./delivery-info.component.scss"],
})
export class DeliveryInfoComponent implements OnInit {
  @Input() deliveryType: any;
  @Input() centered = true;
  constructor() {}

  ngOnInit() {}
}
