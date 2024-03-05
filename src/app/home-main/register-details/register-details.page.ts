import { Component, NgZone, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { ImageCropperPopoverPage } from "src/app/components/popovers/image-cropper-popover/image-cropper-popover.page";
import { ModalService } from "src/app/services/modal.service";
import { ScreenService } from "src/app/services/screen.service";
import { users } from "../../constants";
import { User } from "../../models/user";
import { AwsUploadService } from "../../services/aws-upload.service";
import { GotoProfileService } from "../../services/goto-profile.service";
import { LoginService } from "../../services/login.service";

declare var google: any;

@Component({
  selector: "app-register-four",
  templateUrl: "./register-details.page.html",
  styleUrls: ["./register-details.page.scss"],
})
export class RegisterDetailsPage implements OnInit {
  me: User;
  detailsForm: FormGroup;

  image: {
    base64String: any;
    format: string;
  };
  termsAccepted: boolean = false;

  countryList = [];
  country: {
    flag: string;
    name: string;
  };
  cIndex = 129;
  isImageAdded = false;
  imageFile: any;
  imageData: any = "./../../../assets/img/add-photo.png";

  userType: string;
  cat: string;

  checked = false;

  constructor(
    private loginService: LoginService,
    private firestore: AngularFirestore,
    private ngZone: NgZone,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private awsUpload: AwsUploadService,
    private alertController: AlertController,
    private screen: ScreenService,
    private gotoProfileService: GotoProfileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.detailsForm = this.formBuilder.group({
      brand_name: new FormControl("", Validators.required),
      company_name: new FormControl("", Validators.required),
      company_code: new FormControl("", Validators.required),
      pvm_code: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      telephone_no: new FormControl(""),
      email: new FormControl(""),
      bank_name: new FormControl(""),
      iban: new FormControl(""),
      selected_countries: this.formBuilder.array([]),
      image: new FormControl(""),
      terms: new FormControl(false, Validators.required),
    });
    this.activatedRoute.queryParams.pipe(first()).subscribe((queryParam) => {
      if (queryParam && queryParam.type) {
        this.loginService.getUser().then((user: User) => {
          this.me = user;
          this.userType = queryParam.type;
          this.cat = queryParam.cat;
          this.detailsForm.get("email").patchValue(this.me.email);
          this.getAllCountries();
        });
      }
    });
  }

  async finalUpload() {
    if (!this.me || !this.userType) {
      return;
    }

    if (!this.detailsForm.invalid) {
      await this.loginService.present("Išsaugoma...");
      let imageName = undefined;
      if (
        this.image &&
        this.image.base64String &&
        this.image.base64String !== ""
      ) {
        this.awsUpload
          .uploadImage("brand_logos", imageName, this.image.base64String)
          .then(async (res: any) => {
            imageName = this.makeName("webp", this.me?.uid);
            this.detailsForm.get("image").patchValue(imageName);
            this.updateData(imageName);
          })
          .catch(async (err) => {
            console.log(err);
            await this.loginService.dismiss();
          });
      } else {
        this.updateData(imageName);
      }
    } else {
      this.showWarning();
    }
  }
  async updateData(imageName: string) {
    const details = {
      brand_name: this.detailsForm.get("brand_name").value,
      company_name: this.detailsForm.get("company_name").value,
      company_code: this.detailsForm.get("company_code").value,
      pvm_code: this.detailsForm.get("pvm_code").value,
      address: this.detailsForm.get("address").value,
      telephone_no: this.detailsForm.get("telephone_no").value,
      email: this.detailsForm.get("email").value,
      bank_name: this.detailsForm.get("bank_name").value,
      iban: this.detailsForm.get("iban").value,
      selected_countries: this.detailsForm.get("selected_countries").value,
    };
    let user = {
      ...this.me,
      profile_photo: imageName || this.me.profile_photo,
      rule: this.userType,
      category: this.cat,
      status: "Gamintojas",
      details: details,
    };

    await this.firestore
      .collection(users)
      .doc(this.me.uid)
      .set(user, { merge: true })
      .then(async () => {
        this.me.rule = this.userType;
        this.me.category = this.cat || "";
        this.me.details = user.details;

        await this.loginService
          .saveUser(this.me)
          .then(async () => {
            await this.loginService.dismiss();
            this.gotoProfileService.gotoProfile(this.me);
          })
          .catch(async (err) => {
            await this.loginService.dismiss();
          });
      })
      .catch(async (err) => {
        console.log(err);
        await this.loginService.dismiss();
      });
  }

  makeName(mimeType: string, uid: any): string {
    return uid + "." + mimeType + "?" + Date.now();
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
      this.screen.width.value > 767 ? "image-cropper" : "image-cropper",
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

  addressClicked = false;
  public searchResults = new Array<any>();
  addressChanged() {
    if (!this.detailsForm.get("address").value.trim().length) return;
    let inputBox = document.getElementById("googlePlaces");
    let autoComplete = new google.maps.places.Autocomplete(inputBox, {
      type: "address",
    });
    autoComplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.detailsForm
          .get("address")
          .patchValue(autoComplete.getPlace().formatted_address);
      });
    });
  }
  onFocus(event) {
    event.srcElement.select();
  }

  downloadTermsAndCondition() {
    window.open("https://api.gootweet.com/terms/register_terms.pdf", "_blank");
  }
  getAllCountries() {
    this.detailsForm.get("selected_countries").patchValue([
      {
        flag: "https://restcountries.eu/data/ltu.svg",
        name: "Lithuania",
      },
    ]);
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
          handler: async () => {
            await this.alertController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  terms = `PLATFORMOS GOOTWEET NAUDOJIMOSI SĄLYGOS
    PREKIŲ PARDAVĖJAMS
    
    1.	BENDROSIOS NUOSTATOS 
    1.1.	Ši Sutartis sudaroma tarp UAB „GOOTWEET“, juridinio asmens kodas 305567922, („GOOTWEET“) kuri yra socialinės-komercinės platformos „GOOTWEET“ (toliau – Platforma) administratorius, ir Jūsų – per Platformą platinamų prekių („Prekės“) pardavėjo („Prekių pardavėjas“). Šia Sutartimi yra nustatomos Jūsų teisės ir pareigos Jums registruojantis Platformoje, naudojantis Platformoje teikiamomis paslaugomis ir suteiktomis galimybėms, taip pat Sutarties šalių atsakomybė, Platformos veikimo principai, naudojimosi ja sąlygos bei tvarka. Sutarties priedais, susitarimais, taisyklėmis Jūsų atžvilgiu gali būti nustatomos atskirų paslaugų teikimo sąlygos, specialios šalims taikomos teisės ir pareigos, kurios yra skelbiamos Platformoje arba atskirai pasirašomos tarp šalių.
    1.2.	Ši Sutartis įsigalioja Jums patvirtinus ją registracijos Platformoje metu (nebent būtų susitarta kitaip). Jums patvirtinus atskirus Sutarties priedus, susitarimus, taisykles, jų sąlygos įsigalioja nuo jų patvirtinimo momento ir yra neatsiejama Sutarties dalis. Neatsiejama Sutarties dalis yra ir Platformoje skelbiamos atskiros paslaugų teikimo sąlygos (pavyzdžiui, standartinės sutarčių sąlygos dėl Prekių tiekimo, dėl dizainerio paslaugų ar kitų paslaugų, kuriomis Prekių pardavėjas naudojasi per Platformą, privatumo politika) ir kiti dokumentai, į kuriuos šia Sutartimi pateikiamos nuorodos arba kuriuos GOOTWEET pateikia Prekių pardavėjui registracijos ar Sutarties vykdymo metu. GOOTWEET turi teisę reikalauti, kad tam tikri Sutarties priedai, susitarimai, taisyklės tarp šalių būtų sudaryti ir pasirašyti raštu; ir, tokiu atveju, jie įsigalios tik nuo jų pasirašymo momento. 
    1.3.	Jeigu šios Sutarties prieduose, atskirų paslaugų teikimo sąlygose bus nurodytos kitokios nuostatos nei šioje Sutartyje, turi būti vadovaujamasi ir pirmumas bus teikiamas Sutarties priedų, atskirų paslaugų teikimo sąlygų nuostatoms. 
    1.4.	Prieš registruodamasis Platformoje bei patvirtindamas šią Sutartį, Jūs turite atidžiai perskaityti Sutartį, susipažinti su Privatumo politika ir su visais Jums taikomais Sutarties priedais, susitarimais ar taisyklėmis bei atlikti kitus registracijos metu nurodytus veiksmus. 
    
    2.	PLATFORMA
    2.1.	Platforma yra skirta Prekių pardavėjams sudaryti galimybę siūlyti ir parduoti savo gaminamas / platinamas prekes, o Pirkėjų atžvilgiu – palengvinti reikalingų prekių ar paslaugų įsigijimą ir sukurti malonią pirkimo patirtį, t.y. suvesti Pirkėjus, kurie siekia įsigyti prekę ir/ar gauti interjero, stiliaus ar kitos srities dizaino paslaugą, su atitinkamų ieškomų prekių ar paslaugų teikėjais bei sudaryti galimybę nurodytoms šalims patogiai ir greitai komunikuoti; sudaryti sandorius dėl prekių ar paslaugų įsigijimo; inicijuoti atsiskaitymą; derinti prekių pristatymą ir atlikti kitus prekybinius/ paslaugų teikimo veiksmus.
    2.2.	Platformos paslaugų naudotojai yra šie:
    2.2.1.	Prekių pardavėjai. Prekių pardavėjais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais siekia per Platformą parduoti savo gaminamas ar platinamas prekes. Prekių pardavėjo registracijos Platformoje tvarka ir reikalavimai Prekių pardavėjams nurodyti šios Sutarties 3 skyriuje.
    2.2.2.	Pirkėjai. Šioje Sutartyje Platformos Pirkėjais yra įvardijami pilnamečiai fiziniai ar juridiniai asmenys, kurie savo asmeniniais tikslais arba verslo poreikiams siekia per Platformą įsigyti Prekių pardavėjo siūlomas Prekes ir/ar susijusias Platformoje siūlomas paslaugas.
    2.2.3.	Dizaineriai. Dizaineriais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais bendradarbiauja su Prekių pardavėju(ais) ir siūlo Pirkėjams dizaino konsultacijų paslaugą, kurios metu būtų derinamos / naudojamos atitinkamo Prekių pardavėjo siūlomos (parduodamos) Prekės.
    2.2.4.	Rangos paslaugų teikėjai. Rangos paslaugų teikėjais yra įvardijami fiziniai ar juridiniai asmenys, kuriems yra sudaryta galimybė Platformoje nustatyta tvarka pateikti pasiūlymą Pirkėjui dėl jo įsigytos Prekės sumontavimo, įrengimo ar dėl kitos susijusios rangos paslaugos.
    2.3.	Prekių pardavėjo atžvilgiu GOOTWEET teikia Platformos administravimo ir tarpininkavimo paslaugas ir atlieka šias funkcijas: (a) suteikia galimybę Prekių pardavėjams per Platformą paskelbti apie savo platinamas Prekes, siekiant jas pasiūlyti ir parduoti Pirkėjams; (b) sudaro galimybę Prekių pardavėjams ir Dizaineriams susitarti dėl jų tarpusavio bendradarbiavimo, pagal kurį dizaineris, teikdamas savo paslaugas Pirkėjams, siūlys atitinkamo Prekių pardavėjo Prekes; (c) suteikia galimybę Pirkėjams per Platformą įsigyti Prekes ar paslaugas, t.y. sudaryti Prekių/ paslaugų įsigijimo sandorius; (d) GOOTWEET atlieka atitinkamo Prekių pardavėjo identifikavimą, vertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles; (e) organizuoja Pirkėjo atsiskaitymą už įsigyjamas Prekes ir/ar paslaugas; (f) skelbia informaciją apie užsakymų vykdymo eigą; suteikia galimybę pareikšti atsiliepimus, komentarus ar nusiskundimus dėl atitinkamo Prekių pardavėjo; (g) atstovauja ir gina Platformos naudotojų interesus Platformos ribose (t.y. atlieka veiksmus, siekiant, kad Platforma nebūtų naudojama neteisėtiems veiksmams, Platformos naudotojų teisių pažeidimui), taip pat atlieka kitas Sutartyje, jos prieduose, per Platformą sudarytuose sandoriuose ir teisės aktuose numatytas funkcijas.
    
    3.	REGISTRACIJA PLATFORMOJE. REIKALAVIMAI PREKIŲ PARDAVĖJAMS
    3.1.	Jūs, kaip Prekių pardavėjas, norėdamas naudotis Platforma ir jos teikiamomis paslaugomis, turite užsiregistruoti Platformoje, pateikti visus GOOTWEET prašomus dokumentus ir informaciją, patvirtinti šią Sutartį bei susipažinti su Privatumo politika.
    3.2.	Jūs galėsite siūlyti bei parduoti savo tiekiamas Prekes bei sudaryti Prekių pardavimo sandorius, tik jeigu tinkamai patvirtinsite savo (savo atstovo) tapatybę Platformoje leidžiamais būdais. Informuojame, kad Jums nepatvirtinus savo tapatybės per 6 mėnesius nuo registravimosi Platformoje dienos, GOOTWEET turi teisę panaikinti Jūsų paskyrą ir Platformoje turėsite registruotis iš naujo.
    3.3.	Šią Sutartį kaip Prekių pardavėjas gali sudaryti tiek fizinis, tiek juridinis asmuo. Ją galite sudaryti tik asmeniškai savo vardu ar savo teisėtai atstovaujamo juridinio asmens vardu. Juridinio asmens vardu Sutartį sudaryti gali tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris turi reikiamus įgaliojimus. Atstovas turi pateikti dokumentus, įrodančius atstovavimo teisę bei teisę sudaryti komercinius sandorius Prekių pardavėjo vardu.
    3.4.	Sudarydamas šią Sutartį, Jūs sutinkate bendradarbiauti su GOOTWEET, kad GOOTWEET galėtų nustatyti Jūsų tapatybę (jeigu Jūs esate juridinis asmuo – ir Jūsų atstovų bei, esant poreikiui, ir naudos gavėjų tapatybes), patvirtinti Jūsų kontaktinius duomenis, taip pat sutinkate ir įsipareigojate pateikti visus prašomus dokumentus, informaciją ir paaiškinimus apie savo tapatybę ir vykdomą veiklą. 
    3.5.	Jūs visiškai atsakote už savo pateiktos informacijos, duomenų, dokumentų teisingumą ir aktualumą. Jeigu pateiksite neteisingą informaciją, jos laiku neatnaujinsite, dėl ko gali būti pažeisti Jums/ Jūsų atstovui suteikti įgaliojimai, visa atsakomybė už tai tenka Jums/ Jūsų vardu veikusiems asmenims.
    3.6.	Jūs esate informuotas ir sutinkate, kad GOOTWEET turi teisę savo nuožiūra atsisakyti tvirtinti Jūsų registraciją, tvirtinti Jūsų tapatybę, taip pat turi teisę nustatyti Jums papildomus reikalavimus registracijai ar nustatyti veiklos Platformoje apribojimus, nutraukti šią Sutartį vadovaudamasi Sutarties 9 skyriumi „Draudžiami veiksmai“.
    3.7.	Jūsų ar Jūsų deleguotų atstovų, darbuotojų, naudos gavėjų (jeigu Pirkėjas yra juridinis asmuo) asmens duomenys yra tvarkomi pagal GOOTWEET Privatumo politiką. Jeigu Jūs esate juridinis asmuo, kaip savo atstovų bei naudos gavėjų duomenų valdytojas, Jūs turite užtikrinti, kad Jūs informavote duomenų subjektus apie jų duomenų pateikimą GOOTWEET ir jų duomenų tvarkymą, kaip to reikalauja asmens duomenų tvarkymą reglamentuojantys teisės aktai. Tam tikrais atvejais GOOTWEET gali pareikalauti pateikti originalius raštu pasirašytus sutikimus/ patvirtinimus apie informavimą dėl asmens duomenų tvarkymo iš duomenų subjektų.
    3.8.	Paskyra Platformoje galite naudotis tik pats, o juridinio asmens vardu ja gali naudotis tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris tam turi įgaliojimus. Visi veiksmai, atlikti Jums prisijungus prie Platformos, bus laikomi atliktais Jūsų paties. Jūs suprantate ir patvirtinate, kad visi Jūsų veiksmai, atlikti Jums prisijungus Platformoje, laikomi tinkamais Jūsų sutikimais ir patvirtinimais, pasirašytais elektroniniu parašu, kaip tą numato Elektroninės atpažinties ir elektroninių operacijų patikimumo užtikrinimo paslaugų įstatymo 5 str. 1 d.
    3.9.	Prieš patvirtindama Prekių pardavėjo registraciją, GOOTWEET turi teisę atlikti atitinkamo Prekių pardavėjo identifikavimą bei įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Pagrindiniai Prekių pardavėjams taikomi reikalavimai:
    3.9.1.	Prekių pardavėjas turi būti finansiškai stabilus subjektas; negali turėti bankrutuojančios ar likviduojamos įmonės / asmens statuso;
    3.9.2.	Prekių pardavėjas negali būti nepilnametis fizinis asmuo;
    3.9.3.	Prekių pardavėjo veikla yra prekybinė ir/ar prekių platinimo veikla, kurią vykdydamas Prekių pardavėjas parduoda ar platina naujas (nepanaudotas) bei ne maisto prekes;
    3.9.4.	Prekių pardavėjas negali būti įmonė, kuriai arba kurios vadovams buvo taikyta baudžiamoji atsakomybė (t.y. kurie buvo teisti už padarytas nusikalstamas veikas ir jų atžvilgiu teistumas nėra išnykęs).
    GOOTWEET turi teisę savo nuožiūra ir nedetalizuodamas priežasčių nepatvirtinti Prekių pardavėjo registracijos ir kitais pagrindais, jeigu Prekių pardavėjo veikla ir profilis neatitinka Platformos koncepcijos.
    
    4.	PREKIŲ PARDAVIMO SANDORIAI TARP PREKIŲ PARDAVĖJŲ IR PIRKĖJŲ
    4.1.	Platformoje yra pateikiamos (siūlomos įsigyti) GOOTWEET patvirtintų Prekių pardavėjų Prekės, kurias Pirkėjai gali įsigyti per Platformą. GOOTWEET turi teisę atlikti siūlomų Prekių įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Toks vertinimas gali būti vykdomas tiek iki Prekių patalpinimo Platformoje, tiek po to. Pagrindiniai Prekėms taikomi reikalavimai:
    4.1.1.	Prekės turi būti Prekių pardavėjo nuosavybė arba Prekių pardavėjas turi turėti kitą teisinį pagrindą platinti (parduoti) atitinkamas Prekes. Nurodytų Prekių prekyba yra leistina ir neapribota, Prekių pardavėjas turi turėti visus reikalingus leidimus ar sertifikatus tokių Prekių platinimui (jei taikoma);
    4.1.2.	Prekės turi tinkamos ir leistinos prekiauti toje rinkoje, kurioje jos siūlomos, taip pat atitikti visus tokio tipo Prekėms taikytinus teisės aktų, kokybės, sertifikavimo ar kitus reikalavimus;
    4.1.3.	Prekės turi būti naujos (nepanaudotos) bei nesunaudojamos (ne maisto prekės, ne gėrimai ir pan.);
    4.1.4.	Prekės privalo atitikti ir nepažeisti nusistovėjusių moralės ar viešosios tvarkos principų, jos negali skatinti diskriminacijos, nesantaikos, nesveiko gyvenimo būdo ar kitu būdu skatinti antivertybių.
    GOOTWEET turi teisę nepatvirtinti Prekių arba panaikinti jų prekybą Platformoje ir kitais pagrindais, jeigu Prekės neatitinka Platformos koncepcijos.
    4.2.	Prekių pardavėjas užtikrina ir garantuoja, kad Platformoje jo siūlomos Prekės bus įkainotos sąžiningomis kainomis, ne didesnėmis negu tos, kuriomis Pirkėjas atitinkamą Prekę galėtų įsigyti tiesiogiai iš Prekių pardavėjo.
    4.3.	Platformoje Pirkėjams skelbiama ši pagrindinė informacija apie Prekes: (i) Prekės aprašymas; (ii) Prekės gamintojas (su nuoroda į gamintojo tinklapį); (iii) pagrindinės Prekės savybės; (iii) Prekės kaina; (iv) Prekės nuotrauka ar vizualizacija; kartu gali būti pateikiamos su Preke derančios kitos prekės, detalės; (v) kita informacija, kurią Prekių pardavėjas pageidauja pateikti. Prekių pardavėjo pasirinkimu, kartu su Preke gali būti siūloma dizainerio paslauga; atitinkamos Prekės montavimo / rangos (jei aktualu) paslauga arba kitos susijusios paslaugos. Prekės pardavėjas Prekės paskelbimo metu taip pat turi įvesti kitą Platformos prašomą informaciją, įskaitant Prekės pristatymo sąlygas, siūlomą komisinį mokestį Platformai ir pan.
    4.4.	Prekių pardavėjo atliktas Prekės pateikimas (patalpinimas) Platformoje reiškia viešą Prekių pardavėjo pasiūlymą Pirkėjams įsigyti jo siūlomą Prekę. Atitinkamai, Prekių pardavimo sandoriui sudaryti pakanka Pirkėjo patvirtinimo (valios išreiškimo) įsigyti siūlomą Prekę; atskiro patvirtinimo šiam pardavimo sandoriui iš Prekių pardavėjo pusės nereikia. Pirkėjas Prekių pardavimo sandorį sudaro prisijungdamas prie Platformos savitarnos sistemos ir atlikdamas joje patvirtinimus, vadovaudamasis joje pateiktais pasirinkimais ir veiksmų seka. Pirkėjui patvirtinus Prekės įsigijimo sandorį, Platforma Prekių pardavėjo vardu sugeneruoja ir pateikia Pirkėjui sąskaitą už pasirinktas Prekes (ir paslaugas, jei taikoma). 
    4.5.	Prekės pardavimo sandoris laikomas sudarytu nuo to momento, kai atliekami šie visi veiksmai: (i) Pirkėjas per savo paskyrą pasirenka Prekę, patvirtina suformuotą Prekės užsakymą ir atlieka Prekės kainos apmokėjimą; o (ii) Platforma Prekės pardavėjo vardu patvirtina (priima) Prekės užsakymą, Prekės pardavėjas patvirtina Prekės kainos mokėjimo gavimą bei šio užsakymo priėmimą vykdyti.
    4.6.	Prekės pardavimo sandoriu Prekių pardavėjas įsipareigoja Pirkėjui:
    4.6.1.	Perduoti Pirkėjui nuosavybės teisę į Prekę;
    4.6.2.	Nedelsiant informuoti Pirkėją tuo atveju, jeigu Prekių pardavėjas patvirtintos ir/ar apmokėtos Prekės nebeturi ir pasiūlyti kitą Prekę, o Pirkėjui nepageidaujant kitos Prekės – grąžinti jam sumokėtą Prekės kainą;
    4.6.3.	Pristatyti Prekę Pirkėjo nurodytu adresu;
    4.6.4.	Atsižvelgiant į Prekės tipą, suteikti Prekės naudojimo garantiją, kuri būtų ne mažesnės apimties negu to reikalauja įstatymai;
    4.6.5.	Užtikrinti Prekės priėmimo, jos pakeitimo ar jos kainos grąžinimo sąlygas tuo atveju, kai Pirkėjas teisėtai ją sieks grąžinti, vadovaudamasis Platformos taisyklėmis ir Lietuvos Respublikos civilinio kodekso 6.22810 ir 6.22811 straipsniais (kai Prekė įsigyta asmeninio vartojimo poreikiams) ar kitais taikytinais teisės aktais;
    4.6.6.	Užtikrinti Pirkėjo galimybę pasinaudoti jam įstatymų ar sutarties suteiktomis teisėmis ir gynimo priemonėmis.
    Standartinės sąlygos, kuriomis Prekių pardavėjai parduoda (parduos) savo siūlomas Prekes Pirkėjams, yra pateikiamos Prekių pardavėjo patvirtinimui registracijos Platformoje metu; jos laikomos neatsiejama šios Sutarties dalimi („Prekių pardavimo sandoris“ arba „Prekių įsigijimo sandoris“). Patvirtindamas šią Sutartį, Jūs patvirtinate standartines Prekių pardavimo sandorio sąlygas ir sutinkate, kad Jūsų siūlomos Prekės būtų parduodamos Pirkėjams šių sąlygų pagrindu.
    4.7.	Patvirtindamas šią Sutartį, Jūs:
    4.7.1.	pavedate GOOTWEET be atskiro įgaliojimo, kiek tai reikalinga Prekių pardavimo sandorių sudarymui ir vykdymui, Jūsų vardu ir interesais Platformoje pateikti (siūlyti) Jūsų nurodytas Prekes, pateikti Pirkėjo patvirtinimui Prekių pardavimo sandorio sąlygas, priimti ir patvirtinti Pirkėjų užsakymus dėl Prekių pardavimo, sugeneruoti sąskaitas už parduodamas Prekes ir pateikti jas Pirkėjui apmokėti;
    4.7.2.	Jūs taip pat besąlygiškai ir neatšaukiamai sutinkate ir pavedate GOOTWEET be atskiro įgaliojimo atlikti visų ir bet kokių Platformai pagal šią Sutartį mokėtinų sumų nurašymą (įskaitymą) nuo Prekių pardavėjo pervesto depozito sumos (įskaitant kainą už Platformos teikiamas paslaugas, kaip tai aprašyta šios Sutarties 5.1 - 5.2 p.). Depozito lėšų nurašymo veiksmas atitinkamai atvaizduojamas Platformoje Prekių pardavėjo paskyroje, jo virtualioje piniginėje. 
    Jūs sutinkate, kad GOOTWEET prašymu, Jūs pateiksite teisės aktuose nustatytos formos įgaliojimą šiems aukščiau nurodytiems veiksmams atlikti. Šalys susitaria ir patvirtina, jog šiame punkte numatytas teisių ir įgaliojimų suteikimas Platformai yra esminė Sutarties įgyvendinimo ir Platformos veikimo sąlyga. Atitinkamai, bet koks Prekių pardavėjo pareiškimas dėl šių teisių ir įgaliojimų atšaukimo bus laikomas Sutarties nutraukimu dėl Prekių pardavėjo kaltės.
    4.8.	Prekių pardavėjas privalo nedelsiant informuoti Platformą (GOOTWEET) ir pašalinti Prekę iš Platformos tuo atveju, jeigu atitinkamos Prekės jis nebegamina, nebeturi ar atsisako teikti. 
    4.9.	Jeigu Pirkėjas patvirtina Prekės pirkimo sandorį ir apmoka Prekės kainą, tačiau po šių veiksmų paaiškėja, kad Prekių pardavėjas atitinkamos Prekės neturi – Prekių pardavėjas nedelsiant apie tai informuoja Pirkėją ir Platformą bei grąžina jam atitinkamos Prekės kainą. Prieš grąžindamas Prekės kainą, Prekių pardavėjas turi teisę pateikti Pirkėjui analogiškos Prekės pasiūlymą.
    
    5.	PLATFORMOS PASLAUGŲ KAINA IR ATSISKAITYMO SĄLYGOS
    5.1.	Šia Sutartimi GOOTWEET teikia Prekių pardavėjui Platformos administravimo ir tarpininkavimo paslaugą, kaip atsiskleidęs tarpininkas. Prekių pardavėjas už Platformos teikiamas paslaugas atsiskaito pagal Prekės paskelbimo metu Prekės pardavėjo patvirtintas kainas (komisinį mokestį). Patvirtindamas šią Sutartį, Jūs kartu patvirtinate, kad įsipareigojote atsiskaityti už Platformos teikiamas paslaugas sumokant patvirtintą kainą (komisinį) šioje Sutartyje nustatytomis sąlygomis ir tvarka. Šalių patvirtintas mokestis gali būti nuskaitomas nuo Jūsų pervedamų ar Jums grąžintinų sumų (jei taikoma). 
    5.2.	Jei Platformoje nėra nurodyta kitaip, Platformai mokėtiną komisinį mokestį pasiūlo pats Prekės pardavėjas. Į komisinį mokestį yra įskaičiuota Dizaineriui mokėtina paslaugų kaina. Prekės pardavėjo pasiūlytas komisinio mokesčio dydis yra atskleidžiamas Dizaineriams, prieš priimant sprendimą siūlyti Prekės pardavėjo prekes. 
    5.3.	Depozitas. Prieš pradėdamas siūlyti Prekes Platformoje, Prekių pardavėjas privalo sumokėti GOOTWEET atitinkamo dydžio pinigų sumą („Depozitas“) bankiniu pavedimu į GOOTWEET nurodytą banko sąskaitą. Gauta Depozito suma, ją įskaičius GOOTWEET banko sąskaitoje, ne vėliau kaip per 2 darbo dienas bus atspindėta Prekių pardavėjo paskyroje (t.y. suma bus atspindėta Prekių pardavėjo paskyros virtualioje piniginėje kaip taškai, numatant, jog 1 Eur bus lygus 1 taškui, toliau – virtuali taškų piniginė). Šalys susitaria, jog Depozito suma bus naudojama Prekių pardavėjo Platformai mokėtinoms sumoms dengti. Kilus Prekių teikėjo pareigai sumokėti Platformai, Platforma turi teisę atitinkamą mokėtiną sumą išskaičiuoti iš gauto Depozito bei atitinkamai sumažinti Prekių pardavėjo virtualioje taškų piniginėje pateiktą taškų sumą.
    5.4.	Platforma nurašo Prekės pardavėjo mokėtinas sumas už suteiktas Platformos administravimo ir tarpininkavimo paslaugas nedelsiant po to, kai per Platformą yra sudaromas (patvirtinamas) Pirkėjo ir Prekių pardavėjo Prekės pardavimo sandoris (Sutarties 4.5 p.). 
    5.5.	GOOTWEET turi teisę atlikti visų ir bet kokių Platformai pagal šią Sutartį mokėtinų sumų nurašymą (įskaitymą) nuo Prekių pardavėjo pervesto Depozito sumos, įskaitant kainą už Platformos teikiamas tarpininkavimo paslaugas Prekių pardavėjui (atitinkamai atvaizduojant šį lėšų nurašymo veiksmą platformoje Prekių pardavėjo paskyroje, jo virtualioje taškų piniginėje). Šalys susitaria ir patvirtina, jog Platformos teikiamų tarpininkavimo paslaugų kaina yra nurašoma (įskaitoma) automatiškai ir nedelsiant po to, kai Prekių pardavėjo vardu yra sudaromas Prekių pardavimo sandoris (žr. Sutarties 4.5 p.); o kitos mokėtinos sumos, jei tokių būtų – nuo jų atsiradimo momento. 
    5.6.	Prekių pardavėjo vykdomas Prekės kainos grąžinimas Pirkėjui (pavyzdžiui, paaiškėjus, jog tokios Prekės nėra sandėliuose, ji nebegaminama ar dėl kitų priežasčių) ar bet kokios kitos aplinkybės, susijusios su tuo, kaip sudarytas Prekių pardavimo sandoris yra Prekių pardavėjo ir Pirkėjo vykdomas (pavyzdžiui, jei vėliau išaiškėja, jog Prekė buvo brokuota ir Pirkėjas ją grąžino Prekių pardavėjui; jei Prekių pardavėjas nepristatė Prekės Pirkėjui ir pan.), neturi įtakos Prekių pardavėjo pareigai sumokėti Platformai numatytą mokestį už suteiktas paslaugas. Atitinkamai, nurodytos aplinkybės neriboja Platformos teisės į mokėtinas sumas pagal Sutartį bei teisės šias sumas nurašyti nuo Prekių pardavėjo pervestos Depozito sumos.
    5.7.	Šalys susitaria, jog Platformos pareiga grąžinti gautą savo teikiamų paslaugų kainą (t.y. atstatyti Depozito sumą bei Prekių pardavėjo paskyroje virtualių taškų skaičių) kyla tik tuo atveju, kai (i) dėl paties Pirkėjo kaltės Prekių pardavimo sandoris yra atšaukiamas ir (ii) šis atšaukimas įvyksta iki Prekės pristatymo atitinkamam Pirkėjui.
    
    6.	KOMUNIKACIJA
    6.1.	Jūs turite pateikti Platformai savo (atstovo) telefono numerį, gyvenamosios vietos / buveinės adresą ir elektroninio pašto adresą bei juos patvirtinti. Jūs sutinkate, kad Jūsų pateiktas telefono numeris ir elektroninio pašto adresas, taip pat vidinės Platformos komunikavimo priemonės (pokalbių langai, pranešimai ir pan.) bus naudojami Platformos bendravimui su Jumis, t.y. teikiant informaciją apie Sutartis ar kitas Jums taikomas sąlygas, jų pasikeitimus, įsigaliojimo sąlygas, naujoves, kitą svarbią informaciją. Informacija taip pat bus skelbiama Platformoje. 
    6.2.	Jūs turite nedelsdamas informuoti Platformą apie savo kontaktinės informacijos pasikeitimą atnaujindamas šią informaciją Platformos paskyroje. GOOTWEET vadovaujasi paskutine žinoma informacija apie Jus ir laiko ją teisinga, todėl GOOTWEET neatsako, jeigu negausite informacijos laiku dėl to, kad neatnaujinote savo kontaktinės informacijos ir atitinkamai dėl to patirsite nuostolius.
    
    7.	SUTARTIES PAKEITIMAS
    7.1.	GOOTWEET turi teisę vienašališkai keisti ir (arba) papildyti Sutartį, jos priedus apie tai informuodama Jus skyriuje „Komunikacija“ numatytais būdais.
    7.2.	Apie mokesčių dydžio ir mokėjimo tvarkos, Privatumo politikos pasikeitimus Jūs būsite informuojamas 30 kalendorinių dienų iki pasikeitimų įsigaliojimo. Apie kitus Jums taikomus sąlygų pasikeitimus būsite informuojamas ne vėliau nei sąlygų pasikeitimo dieną.
    7.3.	Jūsų naudojimasis Platforma po Sutarties ar jos atskirų sąlygų, priedų pakeitimo reiškia Jūsų sutikimą su Sutarties pakeitimu.
    7.4.	Jūs neturite teisės vienašališkai keisti šios Sutarties, jos priedų sąlygų.
    
    
    8.	SUTARTIES NUTRAUKIMAS
    8.1.	Ši Sutartis gali būti nutraukta Šalių susitarimu.
    8.2.	Jūs turite teisę nutraukti šią Sutartį įspėjęs apie tai GOOTWEET prieš 30 dienų, jei Sutarties nutraukimo metu neturite neįvykdytų Prekių pardavimo sandorių ir/ar neįvykdytų atsiskaitymų Platformai.
    8.3.	GOOTWEET turi teisę nutraukti šią Sutartį be įspėjimo Sutarties 9 skyriuje „Draudžiami veiksmai“ numatytais atvejais, taip pat jei GOOTWEET su Jumis nutraukia Sutartį kitais Sutartyje numatytais atvejais.
    8.4.	Nutraukus šią Sutartį, yra panaikinama Jūsų paskyra Platformoje, tačiau duomenys apie Jus, apie Jūsų sudarytus Prekių pardavimo sandorius toliau yra saugomi Privatumo politikoje ir teisės aktuose nustatytais tikslais, terminais ir tvarka.
    8.5.	GOOTWEET likvidavimo ar bankroto atveju Prekių pardavimo sandoriai lieka galioti ir jų šalių turi būti įgyvendinami taip, lyg būtų sudaryti GOOTWEET nedalyvaujant.
    
    9.	DRAUDŽIAMI VEIKSMAI
    9.1.	Naudojantis Platforma draudžiama:
    9.1.1.	pažeisti šią Sutartį, Prekių pardavimo sandorius, kitus tarp šalių sudarytus susitarimus, teisės aktus;
    9.1.2.	naudotis Platforma bet kokiems neteisėtiems tikslams, įskaitant bet neapsiribojant: sukčiavimui, pinigų plovimui, teroristų finansavimui, neteisėtam finansinių paslaugų teikimui, nesąžiningai konkurencijai, kt.
    9.1.3.	pateikti GOOTWEET neteisingą ar klaidingą informaciją, neteikti GOOTWEET prašomos informacijos, dokumentų, jos laiku neatnaujinti;
    9.1.4.	veikti Platformoje trečių asmenų vardu ir/ ar naudai, tokio veikimo neatskleidžiant;
    9.1.5.	skleisti kompiuterinius virusus ar imtis kitų veiksmų, kurie gali sukelti Platformos veikimo sutrikimus, pažeidimus ar sukelti kitą žalą GOOTWEET;
    9.1.6.	perduoti arba įvesti į Platformą duomenis, kuriuose galėtų būti programinės įrangos virusų, ar bet kokį kitą kodą, failus ar programas, skirtas trukdyti, riboti arba sugadinti Platformos arba jos įrangos, programinės įrangos ar ryšio įrangos funkcijas, įskaitant programas, kurios automatiškai sektų, naudotų ir/ ar išsaugotų Platformoje esančią/ pateikiamą informaciją;
    9.1.7.	naudoti kitas sistemas prisijungiant prie Platformos ar ja naudojantis;
    9.1.8.	skatinti ir/ ar reklamuoti kitas identiškas ar panašaus pobūdžio paslaugas ar platformas;
    9.1.9.	atskleisti savo prisijungimo prie Platformos duomenis bet kokiems tretiesiems asmenims, naudotis trečiųjų asmenų slaptažodžiais ir kitais prisijungimo duomenimis;
    9.1.10.	sudaryti Prekių pardavimo sandorius pažeidžiant Jums taikomus teisės aktus, sudarytas sutartis, susitarimus ar teismų sprendimus; juridinio asmens atveju – ir Jūsų vidaus dokumentus, Jums suteiktus įgaliojimus, leidimus;
    9.1.11.	atlikti bet kokius veiksmus, kurie gali kelti riziką GOOTWEET.
    9.2.	Jei GOOTWEET turi įtarimą, kad atlikote draudžiamus veiksmus, GOOTWEET gali imtis veiksmų, kad apsaugotų savo, Jūsų ar trečiųjų asmenų interesus, kaip pavyzdžiui:
    9.2.1.	uždaryti ar apriboti prisijungimą prie Jūsų paskyros;
    9.2.2.	apriboti Jūsų veiklą Platformoje, nustatyti Prekių pardavimo (talpinimo) limitus;
    9.2.3.	neleisti sudaryti Prekių pardavimo sandorių ar juos nutraukti;
    9.2.4.	informuoti apie Jūsų veiklą kompetentingas valstybines institucijas;
    9.2.5.	nutraukti šią Sutartį be išankstinio įspėjimo;
    9.2.6.	imtis kitų teisinių priemonių.
    9.3.	GOOTWEET pritaikius šiame skyriuje numatytas priemones, Jūs neturite teisės reikalauti žalos atlyginimo.
    
    10.	ATSAKOMYBĖ
    10.1.	Kiekviena Šalis yra atsakinga už visas baudas, netesybas, nuostolius, kylančius kitai Šaliai dėl kaltosios Šalies padaryto Sutarties pažeidimo. Kaltoji Šalis įsipareigoja atlyginti nukentėjusiai Šaliai dėl tokios atsakomybės kilimo patirtus tiesioginius nuostolius. GOOTWEET atsakomybė pagal Sutartį visais atvejais ribojama vadovaujantis šiomis nuostatomis:
    10.1.1.	GOOTWEET atsakys tik už tiesioginius nuostolius, patirtus dėl GOOTWEET tyčinio ar dėl didelio neatsargumo padaryto tiesioginio ir esminio šios Sutarties pažeidimo, susijusio su GOOTWEET, kaip platformos operatoriaus, veikla, ir tik už tokius, kuriuos GOOTWEET galėjo protingai numatyti Sutarties pažeidimo metu;
    10.1.2.	GOOTWEET visais atvejais neatsakys už Jūsų negautą pelną ir pajamas, reputacijos praradimą, verslo praradimą ar žlugimą, netiesioginius nuostolius;
    10.1.3.	GOOTWEET neatsako už Platformos veiklos sutrikimus, dėl kurių Jūs negalėjote sudaryti savo pasirinktų Prekių pardavimo sandorių ar Jums pritaikytas priemones pagal Sutarties 9 skyrių „Draudžiami veiksmai“.
    10.2.	GOOTWEET veiksmai jokiais atvejais neapima ir negali būti interpretuojami kaip apimantys šias veiklas:
    10.2.1.	finansinį tarpininkavimą (agento veikla);
    10.2.2.	garantavimą ar kitokį užtikrinimą, kad Pirkėjai pirks Prekes, taip pat kad Pirkėjai, dizaineriai ar kitų paslaugų teikėjai tinkamai vykdys kitus savo prisiimtus įsipareigojimus;
    10.2.3.	mokėjimo paslaugų teikimą ir (ar) elektroninių pinigų leidimą;
    10.2.4.	teisinių paslaugų teikimą;
    10.3.	GOOTWEET tik administruoja Platformą, todėl GOOTWEET nėra atsakinga ir negali būti laikoma kalta už  trečiųjų asmenų veiksmus ir (ar) neveikimą, dėl kurių kaltės sutriktų naudojimasis Platforma ir/ ar GOOTWEET paslaugomis bei funkcionalumais. Platforma taip pat nėra atsakinga už tokius trečiųjų asmenų veiksmus, dėl kurių sutriktų naudojimasis Platformos paslaugomis bei funkcionalumais. Platforma deda pastangas užtikrinti saugų ir patikimą naudojimąsi Platformos paslaugomis, tačiau Platforma negarantuoja ir negali užtikrinti, kad per Platformą sudaryti sandoriai ar kiti naudotojų susitarimai, paslaugų teikimas vyks nepažeidžiant teisės aktų reikalavimų, kad jie bus vykdomi numatytomis sąlygomis, kad nebus šių susitarimų pažeidimo ar neteisėtų sandorio šalies veiksmų.
    
    11.	INTELEKTINĖ NUOSAVYBĖ
    11.1.	Platforma, tinklalapiai, Sutarties tekstas ir kiti Platformoje patalpinti dokumentai, prekės ženklai ir visos juose esančios intelektinės nuosavybės teisės, įskaitant bet neapsiribojant bet kokiu turiniu, priklauso GOOTWEET. Intelektinės nuosavybės teisės reiškia tokias teises, kaip: prekių ženklai, autorių teisės, domenų vardai, duomenų bazių teisės, dizaino teisės, patentai, Sutarties ir kitų Platformoje patalpintų dokumentų tekstai / turinys ir visos kitos intelektinės nuosavybės teisės, nepriklausomai nuo to, jos registruotos ar ne. Draudžiama jas kopijuoti, imituoti ar naudoti be GOOTWEET išankstinio rašytinio sutikimo.
    11.2.	Platformoje pateikiamą medžiagą, informaciją, turinį galima kopijuoti, parsisiųsti, saugoti, atgaminti, atspausdinti ar kitaip naudoti tik asmeniniais tikslais ir tik tiek, kiek susiję su Platformos ir GOOTWEET teikiamų paslaugų naudojimu.
    11.3.	Niekas šioje Sutartyje nesuteikia Jums teisės į Platformą ir / ar interneto svetainę, išskyrus tik tas teises, kurios reikalingos paslaugoms gauti.
    11.4.	Platforma pateikiama tokia, kokia yra be jokių tiesioginių ar numanomų, ar įstatymais garantuotų teisių ar garantijų. GOOTWEET negarantuoja, kad Platformos veikimas bus nenutrūkstamas arba be klaidų. GOOTWEET neatsako už bet kokius paslaugų nutraukimus, įskaitant bet neapsiribojant, Platformos gedimus ar kitus sutrikimus, kurie gali turėti įtakos Prekių pardavimo sandorių sudarymui. Platforma nesuteikia garantijų dėl Platformos turinio ar rezultatų, kuriuos Prekių pardavėjas ar kiti naudotojai nori pasiekti (pavyzdžiui, pardavimo apyvartų ir pan.). Atitinkamai, Platforma turi teisę sumažinti ar padidinti tam tikrų Platformos funkcionalumų turinį, diegti keitimus. Prekių pardavėjas neturi teisės reikšti reikalavimų ar pretenzijų dėl Platformos veikimo, jos turinio ar funkcionalumo, kaip nurodyta šiame punkte.
    
    12.	BAIGIAMOSIOS NUOSTATOS
    12.1.	Kiekviena Šalis patvirtina, kad ji turi visus pagal taikytinus teisės aktus reikalingus leidimus ir licencijas atlikti veiksmus, reikalingus šios Sutarties vykdymui.
    12.2.	Jūs neturite teisės perduoti teisių ir pareigų, kylančių iš šios Sutarties, Prekių pardavimo sandorių tretiesiems asmenims be išankstinio raštiško Pirkėjo sutikimo.
    12.3.	Jei kuri nors Sutarties nuostata pripažįstama negaliojančia, likusios Sutarties nuostatos nenustoja galioti.
    12.4.	Sutarčiai, Prekių pardavimo sandoriams taikoma Lietuvos Respublikos teisė.
    12.5.	Visi ginčai tarp Jūsų ir GOOTWEET sprendžiami derybų keliu. Nepasiekus sutarimo, ginčas sprendžiamas teisme, kurio kompetencijai toks ginčas būtų priskiriamas vadovaujantis Lietuvos Respublikos teisės aktais ir GOOTWEET buveinės registracijos adresu.
    
    `;
}
