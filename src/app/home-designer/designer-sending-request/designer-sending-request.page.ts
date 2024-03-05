import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { NotificationData } from "src/app/models/notifications";
import { getTimestamp, getUser } from "src/app/services/functions/functions";
import { MessengerService } from "src/app/services/messenger.service";
import {
  notifications,
  NOTIFICATION_TYPE,
  requests,
  users,
} from "../../constants";
import {
  RequestFromDesigner,
  RequestToManufacturer,
} from "../../models/request";
import { User } from "../../models/user";
import { LoginService } from "../../services/login.service";
import { UtilityService } from "../../services/utility.service";
import { DesignerManufacturerAlphabeticallyService } from "../designer-manufacturer-alphabetically/designer-manufacturer-alphabetically.service";
import { SendRequestService } from "./send-request.service";
import { GotoProfileService } from "../../services/goto-profile.service";
import { first } from "rxjs/operators";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "app-designer-sending-request",
  templateUrl: "./designer-sending-request.page.html",
  styleUrls: ["./designer-sending-request.page.scss"],
})
export class DesignerSendingRequestPage implements OnInit {
  manufacturerId;
  manufacturer;
  me;
  manufacturer_info: {
    name: {
      first_name: " ";
      last_name: " ";
    };
    profile_image: "./../../assets/profile.png";
  };
  designer;
  commission = 25;

  termsAccepted = false;
  checked = false;
  isLoggedin;
  isRequested: boolean = false;
  activity = "";
  aboutMe = "";
  full_name: {
    first_name: " ";
    last_name: " ";
  };

  //imported functions
  constructor(
    public manufacturerService: DesignerManufacturerAlphabeticallyService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private nav: NavController,
    private firestore: AngularFirestore,
    private util: UtilityService,
    private service: SendRequestService,
    private visible: VisibleService,
    private messengerService: MessengerService,
    private gotoProfileService: GotoProfileService
  ) {}

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        if (user.rule !== "designer") {
          this.nav.navigateBack("/");
        }
        if (!this.visible.isLoaded) {
          this.messengerService.openMessenger(user);
          this.visible.isLoaded = true;
        }
        this.activatedRoute.queryParams.pipe(first()).subscribe((param) => {
          this.manufacturerId = param.manufacturer;

          this.firestore
            .collection(users)
            .doc(user.uid)
            .collection(requests)
            .doc(this.manufacturerId)
            .get()
            .pipe(first())
            .subscribe((query) => {
              if (query) {
                let req = query.data();
                if (req?.manufacturer_uid === this.manufacturerId) {
                  this.isRequested = true;
                }
              }
            });

          this.firestore
            .collection(users)
            .doc(this.manufacturerId)
            .get()
            .pipe(first())
            .subscribe((manufacturer) => {
              this.manufacturer = manufacturer.data();
              this.manufacturer_info = {
                name: {
                  first_name: this.manufacturer?.full_name?.first_name,
                  last_name: this.manufacturer?.full_name?.last_name,
                },
                profile_image: this.manufacturer?.profile_photo,
              };
            });
        });
        this.firestore
          .collection(users)
          .doc(user.uid)
          .get()
          .pipe(first())
          .subscribe((query) => {
            if (query) {
              let data: any = query.data();
              if (user.rule === "designer" && data.rule === "designer") {
                this.me = data;
                this.manufacturerService.find(this.me.uid);
                this.full_name = data?.full_name;
                this.aboutMe = data?.about || "";
                this.activity = data?.activity || "";
                this.me.profile_image = data?.profile_photo;
                this.isLoggedin = true;
                this.designer = data;
              } else {
                this.isLoggedin = false;
                this.nav.navigateBack("/");
              }
            }
          });
      } else {
        this.isLoggedin = false;
        this.nav.navigateBack("/");
      }
    });
  }

  sendRequestToManufacturer() {
    if (this.termsAccepted && this.aboutMe !== "" && this.activity !== "") {
      const timestamp = getTimestamp();
      let designerData: RequestFromDesigner = {
        manufacturer_uid: this.manufacturer.uid,
        my_activity: this.activity,
        my_about: this.aboutMe,
        commission: this.commission,
        timestamp: timestamp,
        seen: false,
      };
      let manufacturerData: RequestToManufacturer = {
        designer_uid: this.designer.uid,
        designer_activity: this.activity,
        designer_about: this.aboutMe,
        commission: this.commission,
        timestamp: timestamp,
        seen: false,
      };

      const notification: NotificationData = {
        comment_data: null,
        reaction_data: null,
        senderInfo: this.me,
        request_data: manufacturerData,
        seen: false,
        timestamp: timestamp,
        type: NOTIFICATION_TYPE.REQUEST,
      };
      this.loginService.present("Užklausa siunčiama");
      let manufacturerRef = this.firestore
        .collection(users)
        .doc(this.manufacturer.uid);

      this.firestore
        .collection(notifications)
        .doc(this.manufacturer.uid)
        .collection(notifications)
        .doc(this.manufacturer.uid)
        .set(notification);

      this.service
        .storeRequestDataToDesigner(
          this.designer.uid,
          this.manufacturer.uid,
          designerData
        )
        .then(() => {
          this.service
            .storeRequestDataToManufacturer(
              this.manufacturer.uid,
              this.designer.uid,
              manufacturerData
            )
            .then(() => {
              lastValueFrom(manufacturerRef.get()).then((query) => {
                const data: any = query.data();
                if (data?.unseen_notification == undefined) {
                  manufacturerRef.set(
                    { unseen_notification: 1 },
                    { merge: true }
                  );
                  this.nav.back();
                } else {
                  const unseenNoti = parseInt(data.unseen_notification) + 1;
                  manufacturerRef.set(
                    { unseen_notification: unseenNoti },
                    { merge: true }
                  );
                  this.nav.navigateForward(
                    "designer/designer-manufacturer-alphabetically"
                  );
                }
                this.loginService.dismiss();
              });
            });
        });
    } else {
      this.checked = true;
      this.util.showAlert("Užpildykite visus laukelius!!!", "Patikrinte...");
    }
  }

  downloadTermsAndCondition() {
    window.open(
      "https://furniin.com/terms/request_sending_terms.pdf",
      "_blank"
    );
  }

  findNext(e) {
    if (this.me) {
      this.manufacturerService.find(this.me.uid);
      setTimeout(() => {
        e.target.complete();
      }, 2000);
    }
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  terms = `PER GOOTWEET PLATFORMĄ SUDAROMŲ BENDRADARBIAVIMO SANDORIŲ SĄLYGOS

  1.	BENDROSIOS NUOSTATOS 
  1.1.	Ši bendradarbiavimo sutartis (toliau – Sutartis) yra sudaroma elektroniniu būdu socialinėje – komercinėje platformoje „GOOTWEET“ (toliau – Platforma) ir nustato sąlygas, kuriomis dizaino paslaugų teikėjai (toliau – Dizaineris/ai) ir Platformoje siūlomų prekių pardavėjai (toliau – Prekės pardavėjas/ai) bendradarbiauja siūlant ir teikiant Prekių pirkėjams (toliau – Pirkėjas/ai) interjero, stiliaus ar kitos srities dizaino paslaugą (toliau – Dizaino paslauga), kurias jie gali įsigyti kartu su per Platformą įsigyjamomis prekėmis (toliau – Prekė/s).
  1.2.	Sutartis sudaroma nuotoliniu būdu, Dizaineriui ir Prekės pardavėjui patvirtinant jos sąlygas elektroninėmis priemonėmis Platformos savitarnos sistemoje. Sutartis yra šalims privalomas teisinis dokumentas, kuriame nustatomos Dizainerio ir Pardavėjo teisės bei pareigos, Dizaino paslaugų teikimo bei apmokėjimo už jas sąlygos, Šalių atsakomybė bei kitos su paslaugų teikimu susijusios nuostatos.
  1.3.	Prekės pardavėjas – asmuo, kuris verslo tikslais siekia per Platformą parduoti savo gaminamas ar platinamas prekes. Prekės pardavėjo duomenys (pavadinimas, teisinė forma, juridinio asmens kodas, buveinės ir/ar veiklos adresai, kontaktai komunikacijai bei skundams) yra pateikiami Platformoje patalpintame Prekės pardavėjų sąraše, kuris yra Dizaineriams prieinamas prisijungus prie Platformos savitarnos sistemos.
  1.4.	Dizaineris – asmuo, kuris verslo tikslais bendradarbiauja su Prekių pardavėju(ais) ir siūlo Pirkėjams dizaino konsultacijų paslaugą, kurios metu būtų derinamos / naudojamos atitinkamo Prekių pardavėjo siūlomos (parduodamos) Prekės. Dizainerio duomenys (pavadinimas, teisinė forma, juridinio asmens kodas, buveinės ir/ar veiklos adresai, kontaktai komunikacijai bei skundams) yra pateikiami Platformoje patalpintame Dizainerių sąraše, kuris yra Prekės pardavėjams prieinamas prisijungus prie Platformos savitarnos sistemos.
  1.5.	Platformos administratorius. UAB „GOOTWEET“ yra Platformos administratorius (toliau – GOOTWEET arba Administratorius), kuris tarpininkauja Dizaineriui ir atitinkamos Prekės pardavėjui sudarant Bendradarbiavimo sutartis. UAB „GOOTWEET“ yra uždaroji akcinė bendrovė, kurios juridinio asmens kodas 305567922, buveinės adresas Šilutės r. sav., Kintai, Žirmūnų g. 3-8. Komunikacija su Administratoriumi vykdoma Platformoje integruotomis vidinio komunikavimo priemonėmis.
  1.6.	Bendradarbiavimo sutartis laikoma sudaryta nuo to momento, kai vadovaudamiesi Platformoje pateiktais pasirinkimais ir veiksmų seka, Dizaineris ir atitinkamas Prekės pardavėjas, kurie yra patvirtinę šios Sutarties sąlygas, pasirenka ir patvirtina vienas kitą, kaip šalį, su kuria jie siekia sudaryti šią Sutartį.
  
  2.	SUTARTIES OBJEKTAS
  2.1.	Šia Sutartimi Dizaineris įsipareigoja teikti Prekės pardavėjo klientui (Pirkėjui) Dizaino paslaugą, siūlydamas ir panaudodamas Prekės pardavėjo parduodamas Prekes; o Prekės pardavėjas atitinkamai įsipareigoja suteikti teisę Dizaineriui siūlyti jo Prekes Pirkėjams, bendradarbiauti su Dizaineriu. Prekės pardavėjas atitinkamai įsipareigoja bendradarbiauti su Platforma ir Dizaineriu vykdant Platformos teikiamų paslaugų kainos (komisinio) apmokėjimą, įskaitant pateikti informaciją apie gautą Pirkėjo mokėjimą, kad Platforma galėtų atlikti komisinio mokesčio įskaitymą ir pan. Nurodyta Prekės pardavėjo pareiga yra esminė sąlyga, atsižvelgiant į tai, jog Platformos paslaugų kaina apima ir Dizaino paslaugos kainą, kurią Platforma perves Dizaineriui.
  2.2.	Dizaino paslauga apima dizaino, kūrybinių sprendimų dėl Pirkėjo siekiamos įsigyti Prekės stilingo, kūrybiško panaudojimo, derinimo su kitomis Prekėmis bei interjero/ eksterjero detalėmis, kitokio Prekės pateikimo bei panaudojimo pagal paskirtį paslaugą ir susijusias konsultacijas.
  
  3.	ŠALIŲ BENDRADARBIAVIMAS. PASLAUGŲ TEIKIMO PIRKĖJAMS SĄLYGOS TVARKA
  3.1.	Pirkėjai, įsigydami Prekes, turi teisę gauti nemokamą Dizaino paslaugą, kuri įskaičiuota į Prekės kainą (Platformoje pateikiama kaip „Dizainerio paslauga už ačiū“ ar pan.).  Pirkėjui pasirinkus įsigyti Prekę su nemokama Dizaino paslauga, Platformoje užsiregistravusiems atitinkamos srities Dizaineriams išsiunčiamas automatinis pranešimas ir suteikiama galimybė priimti pateiktą Pirkėjo užsakymą Dizaino paslaugai. Dizaino paslaugą Pirkėjui teikia pirmas atitinkamo Pirkėjo užsakymą patvirtinęs Dizaineris.
  3.2.	Prekių pardavėjui ir Dizaineriui sudarius šią bendradarbiavimo Sutartį, Dizaineris turės teisę siūlyti ir derinti Prekės pardavėjo Prekes pasirinktam (patvirtintam) Pirkėjui.
  3.3.	Dizaineris pareiškia, patvirtina ir įsipareigoja užtikrinti, kad tuo atveju, jeigu Pirkėjas prie Platformos prisijungia per konkretaus Prekių pardavėjo puslapį (t.y. į Platformos tinklapį jis „atėjo“ iš konkretaus Prekės pardavėjo tinklapio), Dizaineris, tokiam Pirkėjui negali siūlyti Prekės pardavėjo konkurento Prekių (t.y. Dizaineris turi teisę siūlyti tik to konkretaus Prekės pardavėjo, per kurio tinklapį Pirkėjas „atėjo“ į Platformą, Prekes arba kito nekonkuruojančio Prekės pardavėjo Prekes). Dizaineriams, kurie pažeidžia šią taisyklę, gali būti taikomi Platformos naudojimosi taisyklėse nurodyti apribojimai (įskaitant pašalinimą iš Platformos naudotojų).
  3.4.	Dizaineris paslaugas Pirkėjams teikia nuotoliniu būdu, naudodamasis Platformos suteiktomis vidinio komunikavimo priemonėmis.
  3.5.	Teikdamas Dizaino paslaugą, Dizaineris įsipareigoja  tinkamai ir profesionaliai teikti paslaugas Pirkėjams, nepiktnaudžiauti savo teisėmis ir įgaliojimais, vengti interesų konflikto Prekės pardavėjų atžvilgiu.
  
  4.	ATSISKAITYMAS UŽ DIZAINO PASLAUGAS
  4.1.	Kartu su pranešimu apie pateiktą Pirkėjo užsakymą Dizaino paslaugai, Dizaineriui pateikiama informacija apie numatytą Dizaino paslaugos kainą (komisinį mokestį), kurį, Pirkėjui įsigijus Prekę, Platforma perves Dizaineriui už suteiktą Dizaino paslaugą.
  4.2.	Dizaino paslaugos kaina yra įskaičiuota į Platformos tarpininkavimo paslaugų kainą, kurią Platformai sumoka Prekių pardavėjas. Platforma, gavusi Prekės pardavėjo mokėjimą už suteiktas tarpininkavimo paslaugas, įsipareigoja sumokėti Dizaineriui nustatyto dydžio komisinį mokestį Platformos naudojimosi taisyklėse numatytomis sąlygomis ir tvarka (padidinat virtualių taškų piniginę). Atsižvelgiant į tai, Šalys susitaria ir patvirtina, kad Prekės pardavėjo bendradarbiavimas ir tinkamas mokėjimų Platformai vykdymas yra esminė ir šios Sutarties sąlyga. Atitinkamai Prekės pardavėjas įsipareigoja bendradarbiauti užtiktinant tinkamą Platformos teikiamų paslaugų kainos  apmokėjimą.
  4.3.	Prekės grąžinimas ar kitos priežastys, dėl kurių Pirkėjas grąžina Prekę ir/ar Prekės kainą neturi įtakos Dizaino paslaugos kainos mokėjimui t.y. nurodytu atveju, Dizaineris neturi pareigos grąžinti Dizaino paslaugos kainos Prekės pardavėjui.
  4.4.	Dizaino paslaugos suteikimo ir apmokėjimo informacija Sutarties šalims pateikiama ir bus išsaugota Platformos savitarnos sistemoje. 
  
  5.	ŠALIŲ ATSAKOMYBĖ
  5.1.	Šalys atsako už savo prisijungimo prie Platformos duomenų perdavimą tretiesiems asmenims. Jei Platformos teikiamomis paslaugomis naudojasi trečiasis asmuo, naudodamasis Šalies prisijungimo duomenimis, Platforma (ir Prekės pardavėjas) šį asmenį atitinkamai laiko Dizaineriu ar Prekės pardavėju, kurio paskyroje atitinkami veiksmai buvo atliekami.
  5.2.	Šalis atleidžiama nuo bet kokios atsakomybės tais atvejais, kai nuostoliai kyla dėl to, jog kita Šalis, neatsižvelgdama į rekomendacijas ir savo įsipareigojimus, nesusipažino su šios Sutarties nuostatomis, nors tokia galimybė jam buvo suteikta.
  5.3.	Atsiradus žalai, kaltoji šalis atlygina kitai šaliai tiesioginius nuostolius.
  
  6.	BAIGIAMOSIOS NUOSTATOS
  6.1.	Šalys visus pranešimus viena kitai siunčia per Platformos savitarnos sistemoje pateiktas vidinio komunikavimo priemones.
  6.2.	Šiai Sutarčiai yra taikoma Lietuvos Respublikos teisė.
  6.3.	Bet kokie Sutarties pakeitimai ar papildymai galioja sudaryti tik raštu, pasirašius (patvirtinus) abiejų Šalių įgaliotiems atstovams. Žodinės išlygos neturi juridinės galios. Jei kuri nors šios Sutarties dalis tampa negaliojanti arba anuliuojama, likusios sutarties dalys lieka galioti.
  6.4.	Visi su šia Sutartimi susiję ginčai sprendžiami derybų keliu. Neišsprendus ginčo derybų keliu, ginčas sprendžiamas kitais, Lietuvos Respublikos įstatymų leidžiamais, būdais.
  `;
}
