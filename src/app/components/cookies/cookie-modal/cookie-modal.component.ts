import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cookie-modal",
  templateUrl: "./cookie-modal.component.html",
  styleUrls: ["./cookie-modal.component.scss"],
})
export class CookieModalComponent implements OnInit, OnDestroy {
  public closePopup: any = false;
  private $cookieConsentService: Subscription;

  constructor(private cookieConsentService: NgcCookieConsentService) {
    this.closePopup = this.getCookie("cookieconsent_status");
    this.$cookieConsentService =
      this.cookieConsentService.statusChange$.subscribe((status) => {
        this.cookieConsentService.destroy();
        this.closePopup = true;
      });
  }
  ngOnInit(): void {
    this.initCookies();
  }

  private initCookies() {
    const cookiesContent = "This is cookies content";

    this.cookieConsentService.getConfig().elements = {
      "custom-modal": `
              <div id="cookieconsent:desc" class="cc-message">
                 <div class="cookie-modal-header">
                     <h2>'COOKIE.POPUP_HELLO')!</h2>
                 </div>
                 <div class="cookie-modal-body">
                   <img src="assets/images/logo-2.png" alt="" />
                   <p>${cookiesContent}</p>
                 </div>
              </div>
            `,
    };
    this.cookieConsentService.getConfig().content.allow = "Allow";
    this.cookieConsentService.getConfig().content.deny = "Deny";
    this.cookieConsentService.init(this.cookieConsentService.getConfig());
  }
  ngOnDestroy(): void {
    this.$cookieConsentService && this.$cookieConsentService.unsubscribe();
  }

  public openCookieModal() {
    this.cookieConsentService.open();
  }

  public acceptCookie() {
    document.cookie = "cookieconsent_status=allow";
    this.closePopup = true;
  }

  public denyCookie() {
    document.cookie = "cookieconsent_status=deny";
    this.closePopup = true;
  }

  private getCookie(cname): string {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
