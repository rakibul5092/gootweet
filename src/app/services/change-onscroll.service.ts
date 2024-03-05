import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChangeOnscrollService {
  scrolledBottom: BehaviorSubject<boolean> = new BehaviorSubject(false);
  changeCategoryDesign: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}
}
