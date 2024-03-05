import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class VisibleService {
  isVisible = new BehaviorSubject<boolean>(false);
  isLoaded = false;
  minimized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showLayout = new BehaviorSubject(true);

  constructor() {}
}
