import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "app-input-with-label",
  templateUrl: "./input-with-label.component.html",
  styleUrls: ["./input-with-label.component.scss"],
})
export class InputWithLabelComponent implements OnInit {
  @Input() label: string;
  @Input() control: string;
  @Input() checked: boolean = false;
  @Input() placeholder: string;
  @Input() disabled: boolean = false;
  form: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  hasError(): boolean {
    if (this.form.controls && this.form.controls[this.control]) {
      return !!this.form.controls[this.control].errors;
    }
    return false;
  }
}
