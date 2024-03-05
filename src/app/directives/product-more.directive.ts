import { Directive, HostListener, Input } from "@angular/core";
import { ScreenService } from "../services/screen.service";

@Directive({
  selector: "[productmoreScrollDirective]",
})
export class ProductMoreDirective {
  @Input() id = "productMoreMobileSlider";
  @Input() containerId = "productMoreMobileSlider";
  private slider: HTMLElement;

  constructor(private screen: ScreenService) {}
  @HostListener("ionScroll", ["$event"])
  onContentScroll(event: any) {
    if (this.screen.width.value < 1140) {
      this.slider = document.getElementById(this.id);
      const container = document.getElementById(this.containerId);
      const containerheight = container?.clientHeight;

      if (container) {
        if (event?.detail?.scrollTop > 220) {
          container.style.minHeight = containerheight + "px";
          container.style.height = containerheight + "px";
          this.slider.classList.add("product-more-slider");
        } else {
          container.style.minHeight = "unset";
          container.style.height = "unset";
          this.slider.classList.remove("product-more-slider");
        }
      }
    }
  }
}
