import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
//firebase
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { LazyLoadImageModule } from "ng-lazyload-image";
// import { Interceptor } from "./services/interceptor.service";
// import {
//   NgcCookieConsentConfig, NgcCookieConsentService
// } from "ngx-cookieconsent";
// import { NgxImageCompressService } from "ngx-image-compress";
import { NgPipesModule } from "ngx-pipes";
import { ToastrModule } from "ngx-toastr";
// import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from "../environments/environment";
// import { environment } from "src/environments/environment";
import { FormsModule } from "@angular/forms";
import { CloudinaryModule } from "@cloudinary/ng";
import { NgAisModule } from "angular-instantsearch";
import { NgGoogleOneTapModule } from "ng-google-one-tap";
import {
  NgcCookieConsentConfig,
  NgcCookieConsentModule,
} from "ngx-cookieconsent";
import { SwiperModule } from "swiper/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ConversationsModule } from "./chat/chat-designer/conversations/conversations.module";
import { UserConversationsModule } from "./chat/chat-normal/user-conversations/user-conversations.module";
import { BottomNavModule } from "./components/layouts/bottom-nav/bottom-nav.module";
import { HeaderPageModule } from "./components/layouts/header/header.module";
import { ToastNotificationComponent } from "./components/popovers/notifications/toast-notification/toast-notification.component";
import { SliderModule } from "./components/product/slider/slider.module";
import { QuickViewModule } from "./components/quick-view/quick-view.module";
import { UserMobileMenuPageModule } from "./home-main/user-mobile-menu/user-mobile-menu.module";
import { AgoraAuthInterceptor } from "./interceptors/cloud-recording.interceptor";
import { UploaderPage } from "./mobile/uploader/uploader.page";
import { GetImageModule } from "./pipes/share-module/get-image/get-image.module";
import { GetPricePipeModule } from "./pipes/share-module/get-price-pipe/get-price-pipe.module";
import { SanitizeImagePipeModule } from "./pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module";
import { SeoService } from "./services/seo.service";
import { ReelUploaderComponent } from "./components/home-page/reels/reel-uploader/reel-uploader.component";
import { CallModule } from "./components/calls/call.module";
const cookieConfig: NgcCookieConsentConfig = {
  compliance: {},
  cookie: {
    domain: environment.domain, // it is recommended to set your domain, for cookies to work properly
  },
  palette: {
    popup: {
      border: "#f8e71c",
      background: "#fff",
    },
  },
  type: "info",
  layout: "my-custom-layout",
  layouts: {
    "my-custom-layout": "{{messagelink}}",
  },
  elements: {
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message">
      <div class="consent-body" style="padding:unset; display: flex; gap:10px">
          <div class="cookies-text" >
            Šioje svetainėje naudojame slapukus, kad užtikrintume tinkamą svetainės veikimą, galėtume suteikti Gootweet.com paslaugas ir funkcijas, analizuotume naršymo statistiką, individualizuotume Jūsų naršymo patirtį bei teiktume Jums aktualius rinkodaros pasiūlymus. Taip pat dalijamės informacija apie tai, kaip naudojatės mūsų svetaine su mūsų socialinės žiniasklaidos, reklamos ir analizės partneriais, kurie gali ją sujungti su kita informacija, kurią jiems pateikėte arba kurią jie surinko naudodamiesi jų paslaugomis. Jūs galite pasirinkti, kokius duomenis leidžiate mums rinkti spustelėdami nuorodą „Valdyti pasirinkimus“. <b>Leisdami visus slapukus, leisite mums užtikrinti geriausią naršymo ir apsipirkimo patirtį.</b> Daugiau informacijos apie slapukų naudojimą 
            <a href="https://gootweet.com/terms-conditions"> slapukų politikoje. </a> 
          </div>

          <div class="cookies-btn-container">
            <button class="cc-btn cc-deny">Paneigti </button>
            <button class="cc-btn cc-allow">
              Leisti visus slapukus </button>
          </div>
      </div>
    </span>
    `,
  },
  //<button style="min-width: 100%;text-decoration: none;padding: 10px 12px;font-size: 0.875em;letter-spacing: 0;color: #007782;border-color: #007782;background-color: #ffffff;margin-top: 1em;">Gestionar cookies</button>

  content: {
    message:
      "Mes ir mūsų partneriai saugome ir/ar turime prieigą prie įrenginyje esančios informacijos, tokios kaip unikalūs identifikatoriai slapukuose, kad galėtume tvarkyti asmens duomenis. Gali priimti arba tvarkyti savo pasirinkimus, įskaitant teisę prieštarauti, jei remiesi teisėtu interesu. Paspausk „Tvarkyti slapukus“ arba užsuk į privatumo politikos puslapį bet kuriuo metu. Apie šiuos pasirinkimus informuojami mūsų partneriai ir tai neturės įtakos tavo naudojimuisi Gootweet.",
    message2:
      "Naudoti tikslius geografinės vietos duomenis. Aktyviai skenuoti įrenginio charakteristikas identifikavimo tikslais. Laikyti ir (arba) gauti informaciją įrenginyje. Suasmeninti skelbimai ir turinys, skelbimų ir jų turinio vertinimas, auditorijos įžvalgos ir produktų kūrimas.",
    cookiePolicyLink: "Slapukų politika",
    cookiePolicyHref: "https://api.gootweet.com/terms/register_terms.pdf",

    privacyPolicyLink: "Partnerių (tiekėjų) sąrašas",
    privacyPolicyHref: "https://api.gootweet.com/terms/register_terms.pdf",

    tosLink: "Terms of Service",
    tosHref: "https://tos.com",
    allow: "Allow",
    deny: "Deny",
  },
};

@NgModule({
  declarations: [
    AppComponent,
    ToastNotificationComponent,
    UploaderPage,
    ReelUploaderComponent,
  ],
  entryComponents: [],
  imports: [
    NgcCookieConsentModule.forRoot(cookieConfig),
    IonicModule.forRoot(),
    FormsModule,
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    UserMobileMenuPageModule,
    HeaderPageModule,
    UserConversationsModule,
    ConversationsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    ToastrModule.forRoot(),
    NgPipesModule,
    BottomNavModule,
    LazyLoadImageModule,
    GetImageModule,
    GetPricePipeModule,
    NgAisModule.forRoot(),
    SanitizeImagePipeModule,
    SwiperModule,
    SliderModule,
    QuickViewModule,
    NgGoogleOneTapModule.config({
      client_id: environment.client_id,
      cancel_on_tap_outside: false,
      authvalidate_by_googleapis: false,
      auto_select: false,
      disable_exponential_cooldowntime: true,
      context: "use",
    }),
    CloudinaryModule,
    CallModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AgoraAuthInterceptor, multi: true },
    SeoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
