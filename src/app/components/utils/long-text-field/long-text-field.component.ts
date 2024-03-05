import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-long-text-field",
  templateUrl: "./long-text-field.component.html",
  styleUrls: ["./long-text-field.component.scss"],
})
export class LongTextFieldComponent implements OnInit {
  @Input() label: string;
  @Input() checked: boolean = false;
  @Input() value: string;
  @Input() placeholder: string;
  @Output() valueEmitter: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() { }
}
