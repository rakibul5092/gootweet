import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ScreenService {
  public width = new BehaviorSubject<number>(0);
  public height = new BehaviorSubject<number>(0);
  public headerHide: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public searchHide: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public onLogin = new BehaviorSubject<boolean>(false);
  public player = new BehaviorSubject(null);
  public playerIndex: number = 0;
  public reelsContainerIndex = 0;
  public fullScreen = new BehaviorSubject<boolean>(false);
  public onQuickView = new BehaviorSubject(null);
  public onCloseQuickView = new BehaviorSubject(false);
  public uploaderModal = new BehaviorSubject(false);
  constructor() {}

  onResize(size: number, height: number) {
    this.width.next(size);
    this.height.next(height);
  }
}
