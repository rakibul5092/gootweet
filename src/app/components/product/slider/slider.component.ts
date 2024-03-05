import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { lazyImage, product_video_base } from "src/app/constants";
import { Product } from "src/app/models/product";
import SwiperCore, { Pagination, SwiperOptions } from "swiper";
import { SwiperComponent } from "swiper/angular";
import { SliderService } from "./slider.service";

SwiperCore.use([Pagination]);
@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.scss"],
})
export class SliderComponent implements OnInit {
  @ViewChild("swiper", { static: false }) swiper?: SwiperComponent;
  @Input() viewImages: any[];
  @Input() viewProduct: Product;
  @Input() isQuickView = true;
  @Input() showAnimation = false;
  @Output() slideChange = new EventEmitter<{ index: number }>();

  productVideoBase = product_video_base;
  default = lazyImage;
  selectedImageSlide = 0;
  public config: SwiperOptions = {
    loop: true,
    pagination: {
      type: "fraction",
    },
    effect: "creative",
    freeMode: true,
  };
  constructor(private sliderService: SliderService) {}

  ngOnInit() {
    this.sliderService.onSliderChange.subscribe((value) => {
      if (value >= 0 && this.swiper && this.swiper.swiperRef) {
        this.selectedImageSlide = value;
        this.swiper.swiperRef.activeIndex = value + 1;
      }
    });
  }

  onAnimationLoad() {
    const gifElement = document.getElementById(
      "productDetailsGif"
    ) as HTMLImageElement;
    console.log(gifElement);
    if (gifElement) {
      setTimeout(() => {
        gifElement.style.display = "none";
        setTimeout(() => {
          gifElement.style.display = "unset";
          setTimeout(() => {
            gifElement.style.display = "none";
          }, 24000);
        }, 20000);
      }, 21000);
    }
    gifElement.onload = (ev) => {
      console.log(ev);
    };
  }

  onSlideChange(event) {
    this.slideChange.emit({ index: event[0].realIndex });
  }

  increase() {
    this.swiper.swiperRef.slideNext();
  }

  decrease() {
    this.swiper.swiperRef.slidePrev();
  }
}
