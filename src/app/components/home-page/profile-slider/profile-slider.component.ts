import { isPlatformServer } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { TransferState, makeStateKey } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { User } from "src/app/models/user";
import { ScreenService } from "src/app/services/screen.service";
import { SwiperOptions } from "swiper";
import { ProfileSliderService } from "./profile-slider.service";

@Component({
  selector: "app-profile-slider",
  templateUrl: "./profile-slider.component.html",
  styleUrls: ["./profile-slider.component.scss"],
})
export class ProfileSliderComponent implements OnInit, OnDestroy {
  @ViewChild("swiper", { static: false }) swiper?: any;
  profiles: User[];
  @Input() me: User;

  config: SwiperOptions = {
    spaceBetween: 6,
    width: 164,
    height: 238,
    loop: true,
    freeMode: true,
  };
  constructor(
    private sliderService: ProfileSliderService,
    public screen: ScreenService,
    private ts: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnDestroy(): void {
    if (this.screenSubs) this.screenSubs.unsubscribe();
  }

  nextSlide() {
    this.swiper.swiperRef.slideNext();
  }
  prevSlide() {
    this.swiper.swiperRef.slidePrev();
  }

  screenSubs: Subscription;
  ngOnInit() {
    this.profiles = [];
    const DATA_KEY = makeStateKey("profile-slider-data");
    if (isPlatformServer(this.platformId)) {
      this.sliderService
        .getRandomProfiles()
        .pipe(first())
        .subscribe((res: any) => {
          this.ts.set(DATA_KEY, res || []);
        });
    } else {
      if (this.ts.hasKey(DATA_KEY)) {
        const data = this.ts.get(DATA_KEY, null) as unknown as User[];
        this.profiles = data;
      } else {
        this.sliderService
          .getRandomProfiles()
          .pipe(first())
          .subscribe((res: any) => {
            this.profiles = res || [];
          });
      }
    }
  }
}
