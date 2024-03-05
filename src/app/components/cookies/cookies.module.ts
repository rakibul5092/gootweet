import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgcCookieConsentModule } from "ngx-cookieconsent";
import { COOKIES_CONFIG } from "./cookies.lookup";
import { CookieModalComponent } from "./cookie-modal/cookie-modal.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [CookieModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [CookieModalComponent],
})
export class CookiesModule {}
