import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-custom-select",
  templateUrl: "./custom-select.component.html",
  styleUrls: ["./custom-select.component.scss"],
})
export class CustomSelectComponent implements OnInit {
  @Input() value: any;
  @Input() placeholder: string;
  @Input() list: any[];
  @Input() isCategory = false;
  @Input() isSubCategory = false;
  @Input() isInnerCategory = false;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  selected() {
    this.onSelect.emit(this.value);
  }

  _compareFn(a, b) {
    // Handle compare logic (eg check if unique ids are the same)
    if (a && b) {
      return a.id === b.id;
    } else {
      return false;
    }
  }
}
