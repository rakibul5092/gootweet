import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  forwardRef,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "gootweet-input-field",
  templateUrl: "./input-field.component.html",
  styleUrls: ["./input-field.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent
  implements AfterViewInit, ControlValueAccessor, OnDestroy
{
  private control: FormControl = new FormControl();
  @Input() label: string;
  @Input() placeholder = " ";
  @Input() type: string;
  @Input() readonly = false;
  @Input() icon: string = "";
  @Input() id: string = "";
  public value: string;
  public disabled: boolean;
  private onTouched: any;
  private onChange: any;
  private destroy$: Subject<void> = new Subject();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value);
      });
  }

  writeValue(value: string): void {
    this.value = value;
    this.control.setValue(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public change(event: any): void {
    this.onChange(event.target.value);
  }

  public touched(touched: boolean) {
    this.onTouched(touched);
  }
}
