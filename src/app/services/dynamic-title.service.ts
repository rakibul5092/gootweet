import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class DynamicTitleService {
  originalTitle: string;
  blinkInterval: any;
  constructor(private titleService: Title) {}

  onNewMessageReceived(firstName: string) {
    this.originalTitle = this.titleService.getTitle();
    this.titleService.setTitle(
      firstName + " parašė jums - " + this.originalTitle
    );

    this.blinkInterval = setInterval(() => {
      if (this.titleService.getTitle() === this.originalTitle) {
        this.titleService.setTitle(
          firstName + " parašė jums - " + this.originalTitle
        );
      } else {
        this.titleService.setTitle(this.originalTitle);
      }
    }, 1000);
  }

  titleReset() {
    if (this.originalTitle && this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.titleService.setTitle(this.originalTitle);
    }
  }
}
