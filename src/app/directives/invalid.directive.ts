import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[appInvalid]",
})
export class InvalidDirective implements OnChanges {
  @Input() appInvalid: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appInvalid.currentValue) {
      this.elementRef.nativeElement.style.border = "1px solid var(--red)";
    } else {
      this.elementRef.nativeElement.style.border = null;
    }
  }
}
