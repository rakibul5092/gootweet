import { Component, NgZone, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { ModalService } from "src/app/services/modal.service";
import { User } from "../../models/user";
import { AwsUploadService } from "../../services/aws-upload.service";
import { LoginService } from "../../services/login.service";
import { getUser } from "../../services/functions/functions";
import { ScreenService } from "src/app/services/screen.service";
import { ImageCropperPopoverPage } from "src/app/components/popovers/image-cropper-popover/image-cropper-popover.page";
import { first } from "rxjs/operators";

declare var google: any;

@Component({
  selector: "app-designer-register-details",
  templateUrl: "./designer-register-details.page.html",
  styleUrls: ["./designer-register-details.page.scss"],
})
export class DesignerRegisterDetailsPage implements OnInit {
  me: User;

  name: string = "";
  sureName: string = "";
  legalPerson: boolean = false;
  individualPerson: boolean = true;
  bankName: string = "";
  bankAccount: string = "";
  companyName: string = "";
  companyCode: string = "";
  pvmCode: string = "";
  address: string = "";
  telephone_no: string = "";
  email: string = "";
  image: {
    base64String: string;
    format: string;
  };

  isImageAdded = false;
  imageFile: any;
  imageData: any = "./../../assets/img/add-photo.png";
  selectedActivity: string = "Interjero dizaineris";
  termsAccepted: boolean = false;
  notAccepted: boolean = false;
  checked: boolean = false;
  userType: string;
  cat: string;
  constructor(
    private loginService: LoginService,
    private firestore: AngularFirestore,
    private nav: NavController,
    private modalService: ModalService,
    public dom: DomSanitizer,
    private ngZone: NgZone,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private awsUpload: AwsUploadService,
    private screen: ScreenService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(first()).subscribe((queryParam) => {
      if (queryParam && queryParam.type) {
        getUser().then((user: User) => {
          this.me = user;
          this.userType = queryParam.type;
          this.cat = queryParam.cat;
          this.email = this.me.email;
        });
      }
    });
  }

  typeSelect(type: any) {
    this.selectedActivity = type;
  }

  onFocus(event) {
    event.srcElement.select();
  }

  addressChanged() {
    if (!this.address.trim().length) return;
    let inputBox = document
      .getElementById("googlePlaces")
      .getElementsByTagName("input")[0];
    let autoComplete = new google.maps.places.Autocomplete(inputBox, {
      type: "address",
    });
    autoComplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.address = autoComplete.getPlace().formatted_address;
      });
    });
  }

  onSubmit() {}

  selectPerson(e) {
    this.individualPerson = true;
    this.legalPerson = false;
  }
  selectCompany(e) {
    this.individualPerson = false;
    this.legalPerson = true;
  }

  makeName(mimeType: string, uid: any): string {
    const timestamp = Number(new Date());
    return "designer_" + uid + "_" + timestamp + "." + mimeType;
  }

  finalUpload() {
    if (!this.me) {
      return;
    }
    if (
      this.termsAccepted &&
      this.address !== "" &&
      this.name !== "" &&
      this.sureName !== "" &&
      this.selectedActivity !== "" &&
      this.bankName !== "" &&
      this.email !== "" &&
      (this.individualPerson || (this.legalPerson && this.companyName)) &&
      this.telephone_no !== ""
    ) {
      this.notAccepted = false;
      this.loginService.present("Išsaugoma...");
      const imageName = this.makeName("webp", this.me?.uid);
      this.awsUpload
        .uploadImage("brand_logos", imageName, this.image.base64String)
        .then((res: any) => {
          let user = {
            profile_photo: imageName,
            full_name: { first_name: this.name, last_name: this.sureName },
            rule: this.userType,
            category: this.cat,
            status: "Konsultantas",
            details: {
              name: this.name,
              sureName: this.sureName,
              areaOfActivity: this.selectedActivity,
              legalPerson: this.legalPerson,
              individualPerson: this.individualPerson,
              bankName: this.bankName || "",
              bankAccount: this.bankAccount || "",
              companyName: this.companyName || "",
              companyCode: this.companyCode || "",
              pvmCode: this.pvmCode || "",
              address: this.address,
              telephone_no: this.telephone_no,
              email: this.me.email,
            },
          };

          this.firestore
            .collection("users")
            .doc(this.me.uid)
            .set(user, { merge: true })
            .then(() => {
              this.me.full_name.first_name = this.name;
              this.me.full_name.last_name = this.sureName;
              this.me.rule = this.userType;
              this.me.category = this.cat;
              this.me.details = user.details;
              this.loginService
                .saveUser(this.me)
                .then(() => {
                  this.screen.onLogin.next(true);
                  this.loginService.dismiss().then(() => {
                    this.nav.navigateForward("/");
                  });
                })
                .catch((err) => {
                  this.loginService.dismiss();
                });
            })
            .catch((err) => {
              console.log(err);
              this.loginService.dismiss();
            });

          this.loginService.dismiss();
        })
        .catch(async (err) => {
          await this.loginService.dismiss();
        });
    } else {
      this.checked = true;
      this.showWarning();
    }
  }

  sanitize(imageData: any) {
    return this.dom.bypassSecurityTrustUrl(imageData);
  }

  onBrowseImage(event: any) {
    this.openImageCropper(event);
  }

  //Image cropper popover here
  async openImageCropper(event: any) {
    const data = {
      imageevent: event,
      ratiox: 1,
      ratioy: 0,
    };
    const cropperModal = await this.modalService.createModal(
      ImageCropperPopoverPage,
      data,
      "image-cropper",
      "ios"
    );

    cropperModal.onDidDismiss().then((res) => {
      if (res?.data) {
        this.isImageAdded = true;
        this.imageData = res.data.base64;
        this.image = {
          base64String: res.data.base64,
          format: "webp",
        };
      }
    });
    await cropperModal.present();
  }

  async showWarning() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: "Įveskite reikiamus laukelius!!!",
      message: "Patikirinkite visus laukelius...",
      mode: "ios",
      buttons: [
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });
    alert.present();
  }

  terms = `PLATFORMOS GOOTWEET NAUDOJIMOSI SĄLYGOS
  DIZAINO PASLAUGŲ TEIKĖJAMS
  
  1.	BENDROSIOS NUOSTATOS 
  1.1.	Ši Sutartis sudaroma tarp UAB „GOOTWEET“, juridinio asmens kodas 305567922, („GOOTWEET“) kuri yra socialinės-komercinės platformos „GOOTWEET“ (toliau – Platforma) administratorius, ir Jūsų – su Platformoje platinamų prekių (toliau – Prekės) pardavimu susijusių dizaino paslaugų teikėju (toliau – Dizaineris). Šia Sutartimi yra nustatomos Jūsų teisės ir pareigos Jums registruojantis Platformoje, naudojantis Platformoje teikiamomis paslaugomis ir suteiktomis galimybėms, taip pat Sutarties šalių atsakomybė, Platformos veikimo principai, naudojimosi ja sąlygos bei tvarka. Sutarties priedais, susitarimais, taisyklėmis Jūsų atžvilgiu gali būti nustatomos atskirų paslaugų teikimo sąlygos, specialios šalims taikomos teisės ir pareigos, kurios yra skelbiamos Platformoje arba atskirai pasirašomos tarp šalių.
  1.2.	Ši Sutartis įsigalioja Jums patvirtinus ją registracijos Platformoje metu (nebent būtų susitarta kitaip). Jums patvirtinus atskirus Sutarties priedus, susitarimus, taisykles, jų sąlygos įsigalioja nuo jų patvirtinimo momento ir yra neatsiejama Sutarties dalis. Neatsiejama Sutarties dalis yra ir Platformoje skelbiamos atskiros paslaugų teikimo sąlygos (pavyzdžiui, standartinės sutarčių sąlygos dėl dizainerio paslaugų ar kitų Jūsų paslaugų, kuriomis Pirkėjas ar Prekių teikėjas naudojasi per Platformą, privatumo politika) ir kiti dokumentai, į kuriuos šia Sutartimi pateikiamos nuorodos arba kuriuos GOOTWEET pateikia Dizaineriui registracijos ar Sutarties vykdymo metu. GOOTWEET turi teisę reikalauti, kad tam tikri Sutarties priedai, susitarimai, taisyklės tarp šalių būtų sudaryti ir pasirašyti raštu; ir, tokiu atveju, jie įsigalios tik nuo jų pasirašymo momento. 
  1.3.	Jeigu šios Sutarties prieduose, atskirų paslaugų teikimo sąlygose bus nurodytos kitokios nuostatos nei šioje Sutartyje, turi būti vadovaujamasi ir pirmumas bus teikiamas Sutarties priedų, atskirų paslaugų teikimo sąlygų nuostatoms. 
  1.4.	Prieš registruodamasis Platformoje bei patvirtindamas šią Sutartį, Jūs turite atidžiai perskaityti Sutartį, susipažinti su Privatumo politika ir su visais Jums taikomais Sutarties priedais, susitarimais ar taisyklėmis bei atlikti kitus registracijos metu nurodytus veiksmus. 
  
  2.	PLATFORMA
  2.1.	Platforma yra skirta Prekių pardavėjams sudaryti galimybę siūlyti ir parduoti savo gaminamas / platinamas prekes kartu su galima dizaino paslauga, o Pirkėjų (pirkėjų) atžvilgiu – palengvinti reikalingų prekių ar paslaugų įsigijimą, sukurti malonią pirkimo patirtį, t.y. suvesti Pirkėjus, kurie siekia įsigyti prekę ir/ar gauti interjero, stiliaus ar kitos srities dizaino paslaugą, su atitinkamų ieškomų prekių ar paslaugų tiekėjais bei sudaryti galimybę nurodytoms šalims patogiai ir greitai komunikuoti; sudaryti atitinkamus sandorius dėl prekių ar paslaugų įsigijimo; atsiskaityti; derinti prekių pristatymą ir atlikti kitus prekybinius/ paslaugų teikimo veiksmus. Platforma taip pat suveda Dizainerius su Prekių pardavėjais, kad šie galėtų sudaryti tarpusavio bendradarbiavimo sandorius, kurių pagrindu Dizaineriai teikdami savo paslaugas gali siūlyti atitinkamo Prekių teikėjo prekes.
  2.2.	Platformos paslaugų naudotojai yra šie:
  2.2.1.	Prekių pardavėjai. Prekių pardavėjais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais siekia per Platformą parduoti savo gaminamas ar platinamas prekes. Prekių pardavėjo registracijos Platformoje tvarka ir reikalavimai Prekių pardavėjams nurodyti šios Sutarties 3 skyriuje.
  2.2.2.	Pirkėjai. Šioje Sutartyje Platformos Pirkėjais yra įvardijami pilnamečiai fiziniai ar juridiniai asmenys, kurie savo asmeniniais tikslais arba verslo poreikiams siekia per Platformą įsigyti Prekių pardavėjo siūlomas prekes ir/ar susijusias Platformoje siūlomas paslaugas;
  2.2.3.	Dizaineriai. Dizaineriais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais bendradarbiauja su Prekių pardavėju(ais) ir siūlo Pirkėjams dizaino konsultacijų paslaugą, kurios metu būtų derinamos / naudojamos atitinkamo Prekių pardavėjo siūlomos (parduodamos) Prekės.
  2.2.4.	Rangos paslaugų teikėjai. Rangos paslaugų teikėjais yra įvardijami fiziniai ar juridiniai asmenys, kuriems yra sudaryta galimybė Platformoje nustatyta tvarka pateikti pasiūlymą Pirkėjui dėl jo įsigytos Prekės sumontavimo, įrengimo ar dėl kitos susijusios rangos paslaugos.
  2.3.	Dizainerio atžvilgiu GOOTWEET teikia Platformos administravimo ir tarpininkavimo paslaugas ir atlieka šias funkcijas: (a) sudaro galimybę Prekių pardavėjams ir Dizaineriams susitarti dėl jų tarpusavio bendradarbiavimo, pagal kurį Dizaineris, teikdamas savo paslaugas Pirkėjams, naudos, siūlys atitinkamo Prekių pardavėjo prekes; (b) suteikia galimybę Pirkėjams per Platformą įsigyti Prekes kartu su siūloma Dizainerio paslauga; (c) atlieka atitinkamo Dizainerio identifikavimą, vertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles; (d) organizuoja Pirkėjo atsiskaitymą už įsigyjamas Prekes (kartu su Dizainerio paslauga); (e) skelbia informaciją apie užsakymų įvykdymo eigą; suteikia galimybę pareikšti atsiliepimus, komentarus ar nusiskundimus dėl atitinkamo Dizainerio ar Prekių pardavėjo; (f) atstovauja ir gina Platformos naudotojų interesus Platformos ribose (t.y. atlieka veiksmus, siekiant, kad Platforma nebūtų naudojama neteisėtiems veiksmams, Platformos naudotojų teisių pažeidimui), taip pat atlieka kitas Sutartyje, jos prieduose, per Platformą sudarytuose sandoriuose ir teisės aktuose numatytas funkcijas.
  
  3.	REGISTRACIJA PLATFORMOJE. REIKALAVIMAI DIZAINERIAMS
  3.1.	Jūs, kaip Dizaineris, norėdamas naudotis Platforma ir jos teikiamomis paslaugomis, turite užsiregistruoti Platformoje, pateikti visus GOOTWEET prašomus dokumentus ir informaciją, patvirtinti šią Sutartį bei susipažinti su Privatumo politika.
  3.2.	Jūs galėsite siūlyti savo paslaugas bei sudaryti Bendradarbiavimo sandorius su Prekių pardavėjais, tik jeigu tinkamai patvirtinsite savo (savo atstovo) tapatybę Platformoje leidžiamais būdais. Informuojame, kad Jums nepatvirtinus savo tapatybės per 6 mėnesius nuo registravimosi Platformoje dienos, GOOTWEET turi teisę panaikinti Jūsų paskyrą ir Platformoje turėsite registruotis iš naujo.
  3.3.	Platformoje galite turėti tik vieną aktyvią paskyrą (paskyra gali turėti kelis valdomus sub-domenus). Bet kokios paskesnės registracijos rezultatai ir naujos paskyros gali būti panaikinamos be atskiro įspėjimo.
  3.4.	Šią Sutartį kaip Dizaineris gali sudaryti tiek fizinis, tiek juridinis asmuo. Ją galite sudaryti tik asmeniškai savo vardu ar savo teisėtai atstovaujamo juridinio asmens vardu. Juridinio asmens vardu Sutartį sudaryti gali tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris turi reikiamus įgaliojimus. Atstovas turi pateikti dokumentus, įrodančius atstovavimo teisę bei teisę sudaryti komercinius sandorius Dizainerio vardu.
  3.5.	Sudarydamas šią Sutartį, Jūs sutinkate bendradarbiauti su GOOTWEET, kad GOOTWEET galėtų nustatyti Jūsų tapatybę (jeigu Jūs esate juridinis asmuo – ir Jūsų atstovų bei, esant poreikiui, ir naudos gavėjų tapatybes), patvirtinti Jūsų kontaktinius duomenis, taip pat sutinkate ir įsipareigojate pateikti visus prašomus dokumentus, informaciją ir paaiškinimus apie savo tapatybę ir vykdomą veiklą. 
  3.6.	Jūs visiškai atsakote už savo pateiktos informacijos, duomenų, dokumentų teisingumą ir aktualumą. Jeigu pateiksite neteisingą informaciją, jos laiku neatnaujinsite, dėl ko gali būti pažeisti Jums/ Jūsų atstovui suteikti įgaliojimai, visa atsakomybė už tai tenka Jums/ Jūsų vardu veikusiems asmenims.
  3.7.	Jūs esate informuotas ir sutinkate, kad GOOTWEET turi teisę savo nuožiūra atsisakyti tvirtinti Jūsų registraciją, tvirtinti Jūsų tapatybę, taip pat turi teisę nustatyti Jums papildomus reikalavimus registracijai ar nustatyti veiklos Platformoje apribojimus, nutraukti šią Sutartį vadovaudamasi Sutarties 9 skyriumi „Draudžiami veiksmai“.
  3.8.	Jūsų ar Jūsų deleguotų atstovų, darbuotojų, naudos gavėjų (jeigu Pirkėjas yra juridinis asmuo) asmens duomenys yra tvarkomi pagal GOOTWEET Privatumo politiką. Jeigu Jūs esate juridinis asmuo, kaip savo atstovų bei naudos gavėjų duomenų valdytojas, Jūs turite užtikrinti, kad Jūs informavote duomenų subjektus apie jų duomenų pateikimą GOOTWEET ir jų duomenų tvarkymą, kaip to reikalauja asmens duomenų tvarkymą reglamentuojantys teisės aktai. Tam tikrais atvejais GOOTWEET gali pareikalauti pateikti originalius raštu pasirašytus sutikimus/ patvirtinimus apie informavimą dėl asmens duomenų tvarkymo iš duomenų subjektų.
  3.9.	Paskyra Platformoje galite naudotis tik pats, o juridinio asmens vardu ja gali naudotis tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris tam turi įgaliojimus. Visi veiksmai, atlikti Jums prisijungus prie Platformos, bus laikomi atliktais Jūsų paties. Jūs suprantate ir patvirtinate, kad visi Jūsų veiksmai, atlikti Jums prisijungus Platformoje, laikomi tinkamais Jūsų sutikimais ir patvirtinimais, pasirašytais elektroniniu parašu, kaip tą numato Elektroninės atpažinties ir elektroninių operacijų patikimumo užtikrinimo paslaugų įstatymo 5 str.1 d.
  3.10.	Prieš patvirtindama Dizainerio registraciją, GOOTWEET turi teisę atlikti atitinkamo Dizainerio identifikavimą bei įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Pagrindiniai Dizaineriams taikomi reikalavimai:
  3.10.1.	Dizaineris turi būti finansiškai stabilus subjektas; negali turėti bankrutuojančios ar likviduojamos įmonės / asmens statuso;
  3.10.2.	Dizaineris negali būti nepilnametis fizinis asmuo;
  3.10.3.	Dizainerio veikla yra dizaino ir kūrybinių sprendimų teikimo paslaugų veikla ir Dizaineris turi ne mažesnę negu 1 metų darbo patirtį šioje srityje;
  3.10.4.	Dizaineris negali būti įmonė, kuriai arba kurios vadovams buvo taikyta baudžiamoji atsakomybė (t.y. kurie buvo teisti už padarytas nusikalstamas veikas ir jų atžvilgiu teistumas nėra išnykęs).
  GOOTWEET turi teisę savo nuožiūra ir nedetalizuodamas priežasčių nepatvirtinti Dizainerio registracijos ir kitais pagrindais, jeigu Dizainerio veikla ir profilis neatitinka Platformos koncepcijos.
  
  4.	BENDRADARBIAVIMO SANDORIAI TARP PREKIŲ PARDAVĖJŲ IR DIZAINERIŲ. DIZAINO PASLAUGOS TEIKIMAS PIRKĖJAMS
  4.1.	Kartu su informacija apie Prekes Pirkėjams gali būti siūloma Dizainerio paslauga, t.y. Pirkėjui suteikiama galimybė kartu su Preke gauti paslaugą, kuri apima dizainą, kūrybinius sprendimus Pirkėjui siekiant stilingai, kūrybiškai panaudoti, derinti ir pateikti Prekę su kitomis Prekėmis, interjero/ eksterjero detalėmis, dėl individualaus Prekės panaudojimo pagal paskirtį ir susijusias konsultacijas.
  4.2.	Aukščiau nurodytu tikslu, Platformoje registruoti Prekių pardavėjai ir Dizaineriai turi galimybę sudaryti Bendradarbiavimo sutartis, pagal kurias Dizaineriai, teikdami paslaugas Pirkėjams, turi teisę derinti ir siūlyti Pirkėjams konkretaus Prekių pardavėjo Prekes.
  4.3.	Platforma Bendradarbiavimo sutartyje nustatyta tvarka pateikia Dizaineriui sąrašą Pirkėjų, kurie pateikė Dizaino paslaugos užsakymą. Kartu su pranešimu apie pateiktą Pirkėjo užsakymą Dizaino paslaugai, Dizaineriui pateikiama informacija apie numatytą Dizaino paslaugos kainą (komisinį mokestį), kurį, Pirkėjui įsigijus Prekę, Platforma perves Dizaineriui už suteiktą Dizaino paslaugą.
  4.4.	Dizaino paslaugos kaina yra įskaičiuota į Platformos tarpininkavimo paslaugų kainą, kurią Platformai sumoka Prekių pardavėjas. Atsiskaitymas su Dizaineriu vyksta atitinkamai padidinant Dizainerio turimus taškus jo paskyroje sukurtoje virtualioje taškų piniginėje, kur 1 Eur bus lygus 1 taškui (toliau – virtuali taškų piniginė). Taškų skaičiui pasiekus 100 taškus arba Sutarties nutraukimo atveju (neatsižvelgiant į taškų skaičių), Dizaineris turi teisę gauti taškus atitinkančio dydžio sumą eurais („išsigryninti taškus“). Nurodytu atveju, išsigryninama suma Dizaineriui pervedama ne vėliau kaip per 2 (dvi) darbo dienas į Dizainerio paskyroje nurodytą mokėjimo sąskaitą.
  4.5.	Platforma įsipareigoja sumokėti Dizaino paslaugos kainą, t.y. padidinti Dizainerio virtualios piniginės taškus, nedelsiant po to, kai yra sudarytas Prekės padavimo sandoris su Dizaino paslauga. Šiuo tikslu, Platforma turi teisę nustatyti reikalavimą Dizaineriui gauti iš Pirkėjo įrodymą apie Prekės kainos apmokėjimą ar kitus sandorio įvykdymo dokumentus. 
  4.6.	Dizaineris atitinkamai patvirtina, kad jam yra žinoma ir suprantama, jog Dizainerio paslaugos suteikimas dar negarantuoja Dizainerio teisės gauti Dizaino paslaugų kainą – t.y. Pirkėjas turi teisę priimti sprendimą nepirkti Prekės, todėl Dizaino paslaugų kaina yra mokėtina Dizaineriui tik su sąlyga, jog Pirkėjas sudaro Prekės įsigijimo sutartį, apmoka Prekės kainą, o Prekės pardavėjas atitinkamai sumoka Platformai tarpininkavimo paslaugos kainą.
  4.7.	Patvirtindamas šią Sutartį, Jūs pavedate GOOTWEET be atskiro įgaliojimo, kiek tai reikalinga Bendradarbiavimo sutarčių sudarymui ir vykdymui, įskaitant dizaino paslaugų Pirkėjams teikimui, Jūsų vardu ir interesais Platformoje siūlyti Jūsų teikiamas dizaino paslaugas, priimti ir patvirtinti Pirkėjų užsakymus dėl dizaino paslaugos suteikimo kartu su Preke, sugeneruoti sąskaitas už teikiamas paslaugas ir atlikti kitus šioje Sutartyje numatytus veiksmus Jūsų vardu. Jūs sutinkate, kad GOOTWEET prašymu, Jūs pateiksite teisės aktuose nustatytos formos įgaliojimą šiems aukščiau nurodytiems veiksmams atlikti. Šalys susitaria ir patvirtina, jog šiame punkte numatytas teisių ir įgaliojimų suteikimas Platformai yra esminė Sutarties įgyvendinimo ir Platformos veikimo sąlyga. Atitinkamai, bet koks Dizainerio pareiškimas dėl šių teisių ir įgaliojimų atšaukimo bus laikomas Sutarties nutraukimu dėl Dizainerio kaltės.
  
  5.	KOMUNIKACIJA
  5.1.	Jūs turite pateikti Platformai savo (atstovo) telefono numerį, gyvenamosios vietos / buveinės adresą ir elektroninio pašto adresą bei juos patvirtinti. Jūs sutinkate, kad Jūsų pateiktas telefono numeris ir elektroninio pašto adresas, taip pat vidinės Platformos komunikavimo priemonės (pokalbių langai, pranešimai ir pan.) bus naudojami Platformos bendravimui su Jumis, t.y. teikiant informaciją apie Sutartis ar kitas Jums taikomas sąlygas, jų pasikeitimus, įsigaliojimo sąlygas, naujoves, kitą svarbią informaciją. Informacija taip pat bus skelbiama Platformoje. 
  5.2.	Jūs turite nedelsdamas informuoti Platformą apie savo kontaktinės informacijos pasikeitimą atnaujindamas šią informaciją Platformos paskyroje. GOOTWEET vadovaujasi paskutine žinoma informacija apie Jus ir laiko ją teisinga, todėl GOOTWEET neatsako, jeigu negausite informacijos laiku dėl to, kad neatnaujinote savo kontaktinės informacijos ir atitinkamai dėl to patirsite nuostolius.
  5.3.	Su Pirkėju bendrauti galite tik naudodamiesi Platformoje pateikiamais būdais. Prašome jokiais kitais būdais nesusisiekti su Pirkėju, tokie Jūsų veiksmai gali būti laikomi neteisėtais ir gali lemti atitinkamas teisines pasekmes, pvz., paslaugų pateikimo per Platformą apribojimą.
  
  6.	SUTARTIES PAKEITIMAS
  6.1.	GOOTWEET turi teisę vienašališkai keisti ir (arba) papildyti Sutartį, jos priedus apie tai informuodama Jus skyriuje „Komunikacija“ numatytais būdais.
  6.2.	Apie mokesčių dydžio ir mokėjimo tvarkos, Privatumo politikos pasikeitimus Jūs būsite informuojamas 30 kalendorinių dienų iki pasikeitimų įsigaliojimo. Apie kitus Jums taikomus sąlygų pasikeitimus būsite informuojamas ne vėliau nei sąlygų pasikeitimo dieną.
  6.3.	Jūsų naudojimasis Platforma po Sutarties ar jos atskirų sąlygų, priedų pakeitimo reiškia Jūsų sutikimą su Sutarties pakeitimu.
  6.4.	Jūs neturite teisės vienašališkai keisti šios Sutarties, jos priedų sąlygų.
  
  7.	SUTARTIES NUTRAUKIMAS
  7.1.	Ši Sutartis gali būti nutraukta Šalių susitarimu.
  7.2.	Jūs turite teisę nutraukti šią Sutartį įspėjęs apie tai GOOTWEET prieš 30 dienų, jei Sutarties nutraukimo metu neturite neįvykdytų Prekių pardavimo su dizaino paslauga sandorių, Bendradarbiavimo sandorių ir/ar neįvykdytų atsiskaitymų Platformai ar kitiems jos naudotojams.
  7.3.	GOOTWEET turi teisę nutraukti šią Sutartį be įspėjimo Sutarties 9 skyriuje „Draudžiami veiksmai“ numatytais atvejais, taip pat jei GOOTWEET su Jumis nutraukia Sutartį kitais Sutartyje numatytais atvejais.
  7.4.	Nutraukus šią Sutartį yra panaikinama Jūsų paskyra Platformoje, tačiau duomenys apie Jus, apie Jūsų sudarytus paslaugų teikimo sandorius, Bendradarbiavimo sandorius toliau yra saugomi Privatumo politikoje ir teisės aktuose nustatytais tikslais, terminais ir tvarka.
  7.5.	GOOTWEET likvidavimo ar bankroto atveju Prekių pardavimo sandoriai lieka galioti ir jų šalių turi būti įgyvendinami taip, lyg būtų sudaryti GOOTWEET nedalyvaujant.
  
  8.	DRAUDŽIAMI VEIKSMAI
  8.1.	Naudojantis Platforma draudžiama:
  8.1.1.	pažeisti šią Sutartį, Prekių pardavimo su dizaino paslauga sandorius, Bendradarbiavimo sandorius, kitus tarp šalių sudarytus susitarimus, teisės aktus;
  8.1.2.	naudotis Platforma bet kokiems neteisėtiems tikslams, įskaitant bet neapsiribojant: sukčiavimui, pinigų plovimui, teroristų finansavimui, neteisėtam finansinių paslaugų teikimui, nesąžiningai konkurencijai, kt.
  8.1.3.	pateikti GOOTWEET neteisingą ar klaidingą informaciją, neteikti GOOTWEET prašomos informacijos, dokumentų, jos laiku neatnaujinti;
  8.1.4.	veikti Platformoje trečių asmenų vardu ir/ ar naudai, tokio veikimo neatskleidžiant;
  8.1.5.	skleisti kompiuterinius virusus ar imtis kitų veiksmų, kurie gali sukelti Platformos veikimo sutrikimus, pažeidimus ar sukelti kitą žalą GOOTWEET;
  8.1.6.	perduoti arba įvesti į Platformą duomenis, kuriuose galėtų būti programinės įrangos virusų, ar bet kokį kitą kodą, failus ar programas, skirtas trukdyti, riboti arba sugadinti Platformos arba jos įrangos, programinės įrangos ar ryšio įrangos funkcijas, įskaitant programas, kurios automatiškai sektų, naudotų ir/ ar išsaugotų Platformoje esančią/ pateikiamą informaciją;
  8.1.7.	naudoti kitas sistemas prisijungiant prie Platformos ar ja naudojantis;
  8.1.8.	skatinti ir/ ar reklamuoti kitas identiškas ar panašaus pobūdžio paslaugas ar platformas;
  8.1.9.	atskleisti savo prisijungimo prie Platformos duomenis bet kokiems tretiesiems asmenims, naudotis trečiųjų asmenų slaptažodžiais ir kitais prisijungimo duomenimis;
  8.1.10.	sudaryti Prekių pardavimo sandorius pažeidžiant Jums taikomus teisės aktus, sudarytas sutartis, susitarimus ar teismų sprendimus; juridinio asmens atveju – ir Jūsų vidaus dokumentus, Jums suteiktus įgaliojimus, leidimus;
  8.1.11.	atlikti bet kokius veiksmus, kurie gali kelti riziką GOOTWEET.
  8.2.	Jei GOOTWEET turi įtarimą, kad atlikote draudžiamus veiksmus, GOOTWEET gali imtis veiksmų, kad apsaugotų savo, Jūsų ar trečiųjų asmenų interesus, kaip pavyzdžiui:
  8.2.1.	uždaryti ar apriboti prisijungimą prie Jūsų paskyros;
  8.2.2.	apriboti Jūsų veiklą / paslaugų teikimą per Platformą;
  8.2.3.	neleisti sudaryti Prekių pardavimo su dizaino paslauga sandorių, Bendradarbiavimo sandorių ar juos nutraukti;
  8.2.4.	informuoti apie Jūsų veiklą kompetentingas valstybines institucijas;
  8.2.5.	nutraukti šią Sutartį be išankstinio įspėjimo;
  8.2.6.	imtis kitų teisinių priemonių.
  8.3.	GOOTWEET pritaikius šiame skyriuje numatytas priemones, Jūs neturite teisės reikalauti žalos atlyginimo.
  
  
  9.	ATSAKOMYBĖ
  9.1.	Kiekviena Šalis yra atsakinga už visas baudas, netesybas, nuostolius, kylančius kitai Šaliai dėl kaltosios Šalies padaryto Sutarties pažeidimo. Kaltoji Šalis įsipareigoja atlyginti nukentėjusiai Šaliai dėl tokios atsakomybės kilimo patirtus tiesioginius nuostolius. GOOTWEET atsakomybė pagal Sutartį visais atvejais ribojama vadovaujantis šiomis nuostatomis:
  9.1.1.	GOOTWEET atsakys tik už tiesioginius nuostolius, patirtus dėl GOOTWEET tyčinio ar dėl didelio neatsargumo padaryto tiesioginio ir esminio šios Sutarties pažeidimo, susijusio su GOOTWEET, kaip platformos operatoriaus, veikla, ir tik už tokius, kuriuos GOOTWEET galėjo protingai numatyti Sutarties pažeidimo metu;
  9.1.2.	GOOTWEET visais atvejais neatsakys už Jūsų negautą pelną ir pajamas, reputacijos praradimą, verslo praradimą ar žlugimą, netiesioginius nuostolius;
  9.1.3.	GOOTWEET neatsako už Platformos veiklos sutrikimus, dėl kurių Jūs negalėjote sudaryti savo pasirinktų Prekių pardavimo sandorių ar Jums pritaikytas priemones pagal Sutarties 9 skyrių „Draudžiami veiksmai“.
  9.2.	GOOTWEET veiksmai jokiais atvejais neapima ir negali būti interpretuojami kaip apimantys šias veiklas:
  9.2.1.	finansinį tarpininkavimą (agento veikla);
  9.2.2.	garantavimą ar kitokį užtikrinimą, kad Pirkėjai pirks Prekes, taip pat kad Pirkėjai, dizaineriai ar kitų paslaugų teikėjai tinkamai vykdys kitus savo prisiimtus įsipareigojimus;
  9.2.3.	mokėjimo paslaugų teikimą ir (ar) elektroninių pinigų leidimą;
  9.2.4.	teisinių paslaugų teikimą;
  9.3.	GOOTWEET tik administruoja Platformą, todėl GOOTWEET nėra atsakinga ir negali būti laikoma kalta už  trečiųjų asmenų veiksmus ir (ar) neveikimą, dėl kurių kaltės sutriktų naudojimasis Platforma ir/ ar GOOTWEET paslaugomis bei funkcionalumais. Platforma taip pat nėra atsakinga už tokius trečiųjų asmenų veiksmus, dėl kurių sutriktų naudojimasis Platformos paslaugomis bei funkcionalumais. Platforma deda pastangas užtikrinti saugų ir patikimą naudojimąsi Platformos paslaugomis, tačiau Platforma negarantuoja ir negali užtikrinti, kad per Platformą sudaryti sandoriai ar kiti naudotojų susitarimai, paslaugų teikimas vyks nepažeidžiant teisės aktų reikalavimų, kad jie bus vykdomi numatytomis sąlygomis, kad nebus šių susitarimų pažeidimo ar neteisėtų sandorio šalies veiksmų.
  
  10.	INTELEKTINĖ NUOSAVYBĖ
  10.1.	Platforma, tinklalapiai, Sutarties tekstas ir kiti Platformoje patalpinti dokumentai, prekės ženklai ir visos juose esančios intelektinės nuosavybės teisės, įskaitant bet neapsiribojant bet kokiu turiniu, priklauso GOOTWEET. Intelektinės nuosavybės teisės reiškia tokias teises, kaip: prekių ženklai, autorių teisės, domenų vardai, duomenų bazių teisės, dizaino teisės, patentai, Sutarties ir kitų Platformoje patalpintų dokumentų tekstai / turinys ir visos kitos intelektinės nuosavybės teisės, nepriklausomai nuo to, jos registruotos ar ne. Draudžiama jas kopijuoti, imituoti ar naudoti be GOOTWEET išankstinio rašytinio sutikimo.
  10.2.	Platformoje pateikiamą medžiagą, informaciją, turinį galima kopijuoti, parsisiųsti, saugoti, atgaminti, atspausdinti ar kitaip naudoti tik asmeniniais tikslais ir tik tiek, kiek susiję su Platformos ir GOOTWEET teikiamų paslaugų naudojimu.
  10.3.	Niekas šioje Sutartyje nesuteikia Jums teisės į Platformą ir / ar interneto svetainę, išskyrus tik tas teises, kurios reikalingos paslaugoms gauti.
  10.4.	Platforma pateikiama tokia, kokia yra be jokių tiesioginių ar numanomų, ar įstatymais garantuotų teisių ar garantijų. GOOTWEET negarantuoja, kad Platformos veikimas bus nenutrūkstamas arba be klaidų. GOOTWEET neatsako už bet kokius paslaugų nutraukimus, įskaitant bet neapsiribojant, Platformos gedimus ar kitus sutrikimus, kurie gali turėti įtakos Prekių pardavimo su dizaino paslauga, Bendradarbiavimo sandorių sudarymui. Platforma nesuteikia garantijų dėl Platformos turinio ar rezultatų, kuriuos Dizaineris ar kiti naudotojai nori pasiekti (pavyzdžiui, pardavimo apyvartų ir pan.). Atitinkamai, Platforma turi teisę sumažinti ar padidinti tam tikrų Platformos funkcionalumų turinį, diegti keitimus. Dizaineris neturi teisės reikšti reikalavimų ar pretenzijų dėl Platformos veikimo, jos turinio ar funkcionalumo, kaip nurodyta šiame punkte.
  
  11.	BAIGIAMOSIOS NUOSTATOS
  11.1.	Kiekviena Šalis patvirtina, kad ji turi visus pagal taikytinus teisės aktus reikalingus leidimus ir licencijas atlikti veiksmus, reikalingus šios Sutarties vykdymui.
  11.2.	Jūs neturite teisės perduoti teisių ir pareigų, kylančių iš šios Sutarties, Prekių pardavimo sandorių tretiesiems asmenims be išankstinio raštiško Pirkėjo sutikimo.
  11.3.	Jei kuri nors Sutarties nuostata pripažįstama negaliojančia, likusios Sutarties nuostatos nenustoja galioti.
  11.4.	Sutarčiai, Prekių pardavimo sandoriams taikoma Lietuvos Respublikos teisė.
  11.5.	Visi ginčai tarp Jūsų ir GOOTWEET sprendžiami derybų keliu. Nepasiekus sutarimo, ginčas sprendžiamas teisme, kurio kompetencijai toks ginčas būtų priskiriamas vadovaujantis Lietuvos Respublikos teisės aktais ir GOOTWEET buveinės registracijos adresu.
  
  `;
}
