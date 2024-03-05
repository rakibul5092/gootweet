import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { lazyImage } from "src/app/constants";
import { HomeService } from "src/app/home-main/home.service";
import { RecomandedProduct } from "src/app/models/product";
import { Video } from "src/app/models/video";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";

@Component({
  selector: "app-right-side-bar",
  templateUrl: "./right-side-bar.component.html",
  styleUrls: ["./right-side-bar.component.scss"],
})
export class RightSideBarComponent implements OnInit {
  @Input() video: Observable<Video>;
  @Input() randomProductsVisible = false;
  randomProducts: RecomandedProduct[] = [];
  default = lazyImage;
  isFirefox = false;
  constructor(
    private gotoProfileService: GotoProfileService,
    private openSingleProductService: OpenSingleProductService,
    @Inject(PLATFORM_ID) private platformId: any,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isFirefox =
        window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    }
  }
  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }
  openProduct(product: RecomandedProduct) {
    this.openSingleProductService.openSingleProduct(
      product.product,
      product.owner
    );
  }
}
