import { Component, Input, OnInit } from "@angular/core";
import { Fields } from "src/app/enums/fields.enum";

@Component({
  selector: "app-manufacturer-info",
  templateUrl: "./manufacturer-info.component.html",
  styleUrls: ["./manufacturer-info.component.scss"],
})
export class ManufacturerInfoComponent implements OnInit {
  @Input() owner: any;
  noInformation = Fields.noInformation;
  constructor() {}
  ngOnInit(): void {}
}
