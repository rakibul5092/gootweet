import { Injectable } from "@angular/core";
import { IonContent } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ScrollService {
  content: IonContent;
  scrolled: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}
}
