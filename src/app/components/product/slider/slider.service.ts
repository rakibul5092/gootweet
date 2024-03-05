import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SliderService {
  public onSliderChange = new BehaviorSubject<number>(-1);
}
