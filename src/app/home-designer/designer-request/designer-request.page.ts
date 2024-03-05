import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { HttpRequestsService } from "src/app/services/http-requests.service";
import { UtilityService } from "src/app/services/utility.service";
import { environment } from "../../../environments/environment";
import { DesignerRequestService } from "./designer-request.service";
import { GotoProfileService } from "../../services/goto-profile.service";
import { getUser } from "../../services/functions/functions";
import { OptionPage } from "src/app/components/designer-vip-option/option/option.page";
import { first } from "rxjs/operators";

@Component({
  selector: "app-designer-request",
  templateUrl: "./designer-request.page.html",
  styleUrls: ["./designer-request.page.scss"],
})
export class DesignerRequestPage implements OnInit {
  requestUid = "";
  designerUid = "";
  manufacturerUid = "";
  isConnected = false;

  termsAccepted = false;
  notAccepted = false;
  baseUrl = environment.baseUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    public designerRequestService: DesignerRequestService,
    private navController: NavController,
    private popoverController: PopoverController,
    private httpService: HttpRequestsService,
    private util: UtilityService,
    private alertController: AlertController,
    private gotoProfileService: GotoProfileService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.requestUid) {
        getUser().then((manufacturer) => {
          this.manufacturerUid = manufacturer.uid;
          this.requestUid = params["requestUid"];
          this.designerRequestService.fetch_notification_data(
            this.requestUid,
            this.manufacturerUid
          );
          this.designerRequestService.getConnectedDesigners(
            this.manufacturerUid
          );

          this.designerRequestService
            .getRequestData(this.manufacturerUid, this.requestUid)
            .pipe(first())
            .subscribe((query) => {
              if (query) {
                let con = query.data();
                if (con) {
                  if (con.desginger_uid === this.requestUid) {
                    this.isConnected = true;
                  }
                }
              }
            });
        });
      }
    });
  }

  acceptRequest() {
    if (this.termsAccepted) {
      this.notAccepted = false;
      this.designerRequestService.requestAccept(
        this.requestUid,
        this.manufacturerUid
      );
    } else {
      this.notAccepted = true;
    }
  }

  terms = `PLATFORMOS GOOTWEET NAUDOJIMOSI SĄLYGOS
  RANGOVAMS
  
  1.	BENDROSIOS NUOSTATOS 
  1.1.	Ši Sutartis sudaroma tarp UAB „Gootweet“, juridinio asmens kodas 305567922, („GOOTWEET“) kuri yra socialinės-komercinės platformos „GOOTWEET“ (toliau – Platforma) administratorius, ir Jūsų – per Platformą siūlomų paslaugų („Paslaugos“) teikėjo („Rangovas“ arba „Rangos paslaugų teikėjas“). Šia Sutartimi yra nustatomos Jūsų teisės ir pareigos Jums registruojantis Platformoje, naudojantis Platformoje teikiamomis paslaugomis ir suteiktomis galimybėms, taip pat Sutarties šalių atsakomybė, Platformos veikimo principai, naudojimosi ja sąlygos bei tvarka. Sutarties priedais, susitarimais, taisyklėmis Jūsų atžvilgiu gali būti nustatomos atskirų paslaugų teikimo sąlygos, specialios šalims taikomos teisės ir pareigos, kurios yra skelbiamos Platformoje arba atskirai pasirašomos tarp šalių.
  1.2.	Ši Sutartis įsigalioja Jums patvirtinus ją registracijos Platformoje metu (nebent būtų susitarta kitaip). Jums patvirtinus atskirus Sutarties priedus, susitarimus, taisykles, jų sąlygos įsigalioja nuo jų patvirtinimo momento ir yra neatsiejama Sutarties dalis. Neatsiejama Sutarties dalis yra ir Platformoje skelbiamos atskiros paslaugų teikimo sąlygos (pavyzdžiui, standartinės rangos paslaugų sutarties sąlygos, privatumo politika) ir kiti dokumentai, į kuriuos šia Sutartimi pateikiamos nuorodos arba kuriuos GOOTWEET pateikia Rangovui registracijos ar Sutarties vykdymo metu. GOOTWEET turi teisę reikalauti, kad tam tikri Sutarties priedai, susitarimai, taisyklės tarp šalių būtų sudaryti ir pasirašyti raštu; ir, tokiu atveju, jie įsigalios tik nuo jų pasirašymo momento. 
  1.3.	Jeigu šios Sutarties prieduose, atskirų paslaugų teikimo sąlygose bus nurodytos kitokios nuostatos nei šioje Sutartyje, turi būti vadovaujamasi ir pirmumas bus teikiamas Sutarties priedų, atskirų paslaugų teikimo sąlygų nuostatoms. 
  1.4.	Prieš registruodamasis Platformoje bei patvirtindamas šią Sutartį, Jūs turite atidžiai perskaityti Sutartį, susipažinti su Privatumo politika ir su visais Jums taikomais Sutarties priedais, susitarimais ar taisyklėmis bei atlikti kitus registracijos metu nurodytus veiksmus. 
  
  2.	PLATFORMA
  2.1.	Platforma yra skirta Rangovams sudaryti galimybę siūlyti savo teikiamas paslaugas, o Pirkėjų atžvilgiu – palengvinti reikalingų prekių ar paslaugų įsigijimą ir sukurti malonią pirkimo patirtį, t.y. suvesti Pirkėjus, kurie siekia įsigyti prekę ir/ar gauti interjero, stiliaus ar kitos srities dizaino paslaugą, su atitinkamų ieškomų prekių ar paslaugų teikėjais bei sudaryti galimybę nurodytoms šalims patogiai ir greitai komunikuoti; sudaryti sandorius dėl prekių ar paslaugų įsigijimo; inicijuoti atsiskaitymą; derinti prekių pristatymą ir atlikti kitus prekybinius/ paslaugų teikimo veiksmus.
  2.2.	Platformos paslaugų naudotojai yra šie:
  2.2.1.	Prekių pardavėjai. Prekių pardavėjais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais siekia per Platformą parduoti savo gaminamas ar platinamas prekes. Prekių pardavėjo registracijos Platformoje tvarka ir reikalavimai Prekių pardavėjams nurodyti šios Sutarties 3 skyriuje.
  2.2.2.	Pirkėjai. Šioje Sutartyje Platformos Pirkėjais yra įvardijami pilnamečiai fiziniai ar juridiniai asmenys, kurie savo asmeniniais tikslais arba verslo poreikiams siekia per Platformą įsigyti Prekių pardavėjo siūlomas Prekes ir/ar susijusias Platformoje siūlomas paslaugas.
  2.2.3.	Dizaineriai. Dizaineriais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais bendradarbiauja su Prekių pardavėju(ais) ir siūlo Pirkėjams dizaino konsultacijų paslaugą, kurios metu būtų derinamos / naudojamos atitinkamo Prekių pardavėjo siūlomos (parduodamos) Prekės.
  2.2.4.	Rangos paslaugų teikėjai (Rangovai). Rangos paslaugų teikėjais yra įvardijami fiziniai ar juridiniai asmenys, kuriems yra sudaryta galimybė Platformoje nustatyta tvarka pateikti pasiūlymą Pirkėjui dėl jo įsigytos Prekės sumontavimo, įrengimo ar dėl kitos susijusios rangos paslaugos.
  2.3.	Rangovo atžvilgiu GOOTWEET teikia Platformos administravimo ir tarpininkavimo paslaugas ir atlieka šias funkcijas: (a) suteikia galimybę per Platformą siūlyti savo paslaugas, susitarti dėl šių paslaugų teikimo sąlygų; (b) GOOTWEET atlieka atitinkamo Rangovo identifikavimą, vertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles; (c)  suteikia galimybę pareikšti atsiliepimus, komentarus ar nusiskundimus dėl atitinkamo Rangovo; (d) atstovauja ir gina Platformos naudotojų interesus Platformos ribose (t.y. atlieka veiksmus, siekiant, kad Platforma nebūtų naudojama neteisėtiems veiksmams, Platformos naudotojų teisių pažeidimui), taip pat atlieka kitas Sutartyje, jos prieduose, per Platformą sudarytuose sandoriuose ir teisės aktuose numatytas funkcijas.
  
  3.	REGISTRACIJA PLATFORMOJE. REIKALAVIMAI RANGOVAMS
  3.1.	Jūs, kaip Rangovas, norėdamas naudotis Platforma ir jos teikiamomis paslaugomis, turite užsiregistruoti Platformoje, pateikti visus GOOTWEET prašomus dokumentus ir informaciją, patvirtinti šią Sutartį bei susipažinti su Privatumo politika.
  3.2.	Jūs galėsite siūlyti bei teikti savo Paslaugas bei sudaryti Prekių pardavimo sandorius, tik jeigu tinkamai patvirtinsite savo (savo atstovo) tapatybę Platformoje leidžiamais būdais. Informuojame, kad Jums nepatvirtinus savo tapatybės per 6 mėnesius nuo registravimosi Platformoje dienos, GOOTWEET turi teisę panaikinti Jūsų paskyrą ir Platformoje turėsite registruotis iš naujo.
  3.3.	Šią Sutartį kaip Rangovas gali sudaryti tiek fizinis, tiek juridinis asmuo. Ją galite sudaryti tik asmeniškai savo vardu ar savo teisėtai atstovaujamo juridinio asmens vardu. Juridinio asmens vardu Sutartį sudaryti gali tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris turi reikiamus įgaliojimus. Atstovas turi pateikti dokumentus, įrodančius atstovavimo teisę bei teisę sudaryti komercinius sandorius Rangovo vardu.
  3.4.	Sudarydamas šią Sutartį, Jūs sutinkate bendradarbiauti su GOOTWEET, kad GOOTWEET galėtų nustatyti Jūsų tapatybę (jeigu Jūs esate juridinis asmuo – ir Jūsų atstovų bei, esant poreikiui, ir naudos gavėjų tapatybes), patvirtinti Jūsų kontaktinius duomenis, taip pat sutinkate ir įsipareigojate pateikti visus prašomus dokumentus, informaciją ir paaiškinimus apie savo tapatybę ir vykdomą veiklą. 
  3.5.	Jūs visiškai atsakote už savo pateiktos informacijos, duomenų, dokumentų teisingumą ir aktualumą. Jeigu pateiksite neteisingą informaciją, jos laiku neatnaujinsite, dėl ko gali būti pažeisti Jums/ Jūsų atstovui suteikti įgaliojimai, visa atsakomybė už tai tenka Jums/ Jūsų vardu veikusiems asmenims.
  3.6.	Jūs esate informuotas ir sutinkate, kad GOOTWEET turi teisę savo nuožiūra atsisakyti tvirtinti Jūsų registraciją, tvirtinti Jūsų tapatybę, taip pat turi teisę nustatyti Jums papildomus reikalavimus registracijai ar nustatyti veiklos Platformoje apribojimus, nutraukti šią Sutartį vadovaudamasi Sutarties 9 skyriumi „Draudžiami veiksmai“.
  3.7.	Jūsų ar Jūsų deleguotų atstovų, darbuotojų, naudos gavėjų (jeigu Pirkėjas yra juridinis asmuo) asmens duomenys yra tvarkomi pagal GOOTWEET Privatumo politiką. Jeigu Jūs esate juridinis asmuo, kaip savo atstovų bei naudos gavėjų duomenų valdytojas, Jūs turite užtikrinti, kad Jūs informavote duomenų subjektus apie jų duomenų pateikimą GOOTWEET ir jų duomenų tvarkymą, kaip to reikalauja asmens duomenų tvarkymą reglamentuojantys teisės aktai. Tam tikrais atvejais GOOTWEET gali pareikalauti pateikti originalius raštu pasirašytus sutikimus/ patvirtinimus apie informavimą dėl asmens duomenų tvarkymo iš duomenų subjektų.
  3.8.	Paskyra Platformoje galite naudotis tik pats, o juridinio asmens vardu ja gali naudotis tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris tam turi įgaliojimus. Visi veiksmai, atlikti Jums prisijungus prie Platformos, bus laikomi atliktais Jūsų paties. Jūs suprantate ir patvirtinate, kad visi Jūsų veiksmai, atlikti Jums prisijungus Platformoje, laikomi tinkamais Jūsų sutikimais ir patvirtinimais, pasirašytais elektroniniu parašu, kaip tą numato Elektroninės atpažinties ir elektroninių operacijų patikimumo užtikrinimo paslaugų įstatymo 5 str. 1 d.
  3.9.	Prieš patvirtindama Rangovo registraciją, GOOTWEET turi teisę atlikti atitinkamo Rangovo identifikavimą bei įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Pagrindiniai Rangovams taikomi reikalavimai:
  3.9.1.	Rangovas turi būti finansiškai stabilus subjektas; negali turėti bankrutuojančios ar likviduojamos įmonės / asmens statuso;
  3.9.2.	Rangovas negali būti nepilnametis fizinis asmuo;
  3.9.3.	Rangovo veikla yra teisėtai vykdoma ūkinė komercinė veikla;  
  3.9.4.	Rangovas negali būti įmonė, kuriai arba kurios vadovams buvo taikyta baudžiamoji atsakomybė (t.y. kurie buvo teisti už padarytas nusikalstamas veikas ir jų atžvilgiu teistumas nėra išnykęs).
  GOOTWEET turi teisę savo nuožiūra ir nedetalizuodamas priežasčių nepatvirtinti Rangovo registracijos ir kitais pagrindais, jeigu Rangovo veikla ir profilis neatitinka Platformos koncepcijos.
  
  4.	PASLAUGŲ SANDORIAI TARP RANGOVŲ IR PIRKĖJŲ
  4.1.	Kartu su Platformoje pateiktomis (siūlomomis įsigyti) Prekėmis, Pirkėjams gali būti teikiamos GOOTWEET patvirtintų Rangovų Paslaugos, kurias Pirkėjai gali užsisakyti per Platformą. GOOTWEET turi teisę atlikti siūlomų Paslaugų įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Toks vertinimas gali būti vykdomas tiek iki Paslaugų pasiūlymo patalpinimo Platformoje, tiek po to. Pagrindiniai Paslaugoms taikomi reikalavimai:
  4.1.1.	Paslaugos turi būti teikiamos teisėtai, nepažeidžiant teisės aktų reikalavimų ir Rangovo sutartinių įsipareigojimų;
  4.1.2.	Rangovas turi turėti visus reikalingus leidimus ar sertifikatus tokių Paslaugų teikimui (jei taikoma).
  GOOTWEET turi teisę nepatvirtinti Paslaugų arba panaikinti jų siūlymą Platformoje ir kitais pagrindais, jeigu Paslaugos neatitinka Platformos koncepcijos.
  4.2.	Siekdamas, kad Platforma pateiktų Pirkėjams Rangovo Paslaugų pasiūlymą, Rangovas turi pateikti siūlomos Paslaugos turinį ir kainą. Paslaugų teikimo sąlygas Rangovas ir Pirkėjas galutinai suderina ir sudaro atitinkamą Paslaugų sutartį tarpusavyje atskirai (ne per Platformą). Atitinkamai Platforma nėra atsakinga už tinkamą Paslaugų teikimo sutarties sudarymą ir/ar vykdymą.
  4.3.	Patvirtindamas šią Sutartį, Jūs pavedate GOOTWEET be atskiro įgaliojimo, kiek tai reikalinga Paslaugų pasiūlymų pateikimui per Platformą, Jūsų vardu ir interesais Platformoje pateikti (siūlyti) Jūsų Paslaugas, priimti ir patvirtinti Pirkėjų užsakymus dėl Paslaugų teikimo.
  4.4.	Jūs sutinkate, kad GOOTWEET prašymu, Jūs pateiksite teisės aktuose nustatytos formos įgaliojimą šiems aukščiau nurodytiems veiksmams atlikti. Šalys susitaria ir patvirtina, jog šiame punkte numatytas teisių ir įgaliojimų suteikimas Platformai yra esminė Sutarties įgyvendinimo ir Platformos veikimo sąlyga. Atitinkamai, bet koks Rangovo pareiškimas dėl šių teisių ir įgaliojimų atšaukimo bus laikomas Sutarties nutraukimu dėl Rangovo kaltės.
  4.5.	Rangovas privalo nedelsiant informuoti Platformą (GOOTWEET) ir pašalinti Paslaugos pasiūlymą iš Platformos tuo atveju, jeigu atitinkamos Paslaugos jis nebeteikia ar atsisako teikti. 
  
  5.	PLATFORMOS PASLAUGŲ KAINA IR ATSISKAITYMO SĄLYGOS
  5.1.	Šia Sutartimi GOOTWEET teikia Rangovui Platformos administravimo ir tarpininkavimo paslaugą, kaip atsiskleidęs tarpininkas. Rangovas už Platformos teikiamas paslaugas atsiskaito sumokėdamas Platformos nurodytą fiksuotą mokestį už naudojimąsi Platformos paslaugomis. 
  5.2.	Patvirtindamas šią Sutartį, Jūs kartu patvirtinate, kad įsipareigojote atsiskaityti už Platformos teikiamas paslaugas sumokant patvirtintą kainą šioje Sutartyje nustatytomis sąlygomis ir tvarka. Šalių patvirtintas mokestis gali būti nuskaitomas nuo Jūsų pervedamų ar Jums grąžintinų sumų (jei taikoma). 
  
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
  8.2.	Jūs turite teisę nutraukti šią Sutartį įspėjęs apie tai GOOTWEET prieš 30 dienų, jei Sutarties nutraukimo metu neturite neįvykdytų atsiskaitymų Platformai.
  8.3.	GOOTWEET turi teisę nutraukti šią Sutartį be įspėjimo Sutarties 9 skyriuje „Draudžiami veiksmai“ numatytais atvejais, taip pat jei GOOTWEET su Jumis nutraukia Sutartį kitais Sutartyje numatytais atvejais.
  8.4.	Nutraukus šią Sutartį, yra panaikinama Jūsų paskyra Platformoje, tačiau duomenys apie Jus, apie Jūsų sudarytus sandorius toliau yra saugomi Privatumo politikoje ir teisės aktuose nustatytais tikslais, terminais ir tvarka.
  8.5.	GOOTWEET likvidavimo ar bankroto atveju Paslaugų teikimo sandoriai lieka galioti ir jų šalių turi būti įgyvendinami taip, lyg būtų sudaryti GOOTWEET nedalyvaujant.
  
  9.	DRAUDŽIAMI VEIKSMAI
  9.1.	Naudojantis Platforma draudžiama:
  9.1.1.	pažeisti šią Sutartį, Paslaugų teikimo sandorius, kitus tarp šalių sudarytus susitarimus, teisės aktus;
  9.1.2.	naudotis Platforma bet kokiems neteisėtiems tikslams, įskaitant bet neapsiribojant: sukčiavimui, pinigų plovimui, teroristų finansavimui, neteisėtam finansinių paslaugų teikimui, nesąžiningai konkurencijai, kt.
  9.1.3.	pateikti GOOTWEET neteisingą ar klaidingą informaciją, neteikti GOOTWEET prašomos informacijos, dokumentų, jos laiku neatnaujinti;
  9.1.4.	veikti Platformoje trečių asmenų vardu ir/ ar naudai, tokio veikimo neatskleidžiant;
  9.1.5.	skleisti kompiuterinius virusus ar imtis kitų veiksmų, kurie gali sukelti Platformos veikimo sutrikimus, pažeidimus ar sukelti kitą žalą GOOTWEET;
  9.1.6.	perduoti arba įvesti į Platformą duomenis, kuriuose galėtų būti programinės įrangos virusų, ar bet kokį kitą kodą, failus ar programas, skirtas trukdyti, riboti arba sugadinti Platformos arba jos įrangos, programinės įrangos ar ryšio įrangos funkcijas, įskaitant programas, kurios automatiškai sektų, naudotų ir/ ar išsaugotų Platformoje esančią/ pateikiamą informaciją;
  9.1.7.	naudoti kitas sistemas prisijungiant prie Platformos ar ja naudojantis;
  9.1.8.	skatinti ir/ ar reklamuoti kitas identiškas ar panašaus pobūdžio paslaugas ar platformas;
  9.1.9.	atskleisti savo prisijungimo prie Platformos duomenis bet kokiems tretiesiems asmenims, naudotis trečiųjų asmenų slaptažodžiais ir kitais prisijungimo duomenimis;
  9.1.10.	sudaryti sandorius pažeidžiant Jums taikomus teisės aktus, sudarytas sutartis, susitarimus ar teismų sprendimus; juridinio asmens atveju – ir Jūsų vidaus dokumentus, Jums suteiktus įgaliojimus, leidimus;
  9.1.11.	atlikti bet kokius veiksmus, kurie gali kelti riziką GOOTWEET.
  9.2.	Jei GOOTWEET turi įtarimą, kad atlikote draudžiamus veiksmus, GOOTWEET gali imtis veiksmų, kad apsaugotų savo, Jūsų ar trečiųjų asmenų interesus, kaip pavyzdžiui:
  9.2.1.	uždaryti ar apriboti prisijungimą prie Jūsų paskyros;
  9.2.2.	apriboti Jūsų veiklą Platformoje, įskaitant Jūsų Paslaugų siūlymą;
  9.2.3.	informuoti apie Jūsų veiklą kompetentingas valstybines institucijas;
  9.2.4.	nutraukti šią Sutartį be išankstinio įspėjimo;
  9.2.5.	imtis kitų teisinių priemonių.
  9.3.	GOOTWEET pritaikius šiame skyriuje numatytas priemones, Jūs neturite teisės reikalauti žalos atlyginimo.
  
  10.	ATSAKOMYBĖ
  10.1.	Kiekviena Šalis yra atsakinga už visas baudas, netesybas, nuostolius, kylančius kitai Šaliai dėl kaltosios Šalies padaryto Sutarties pažeidimo. Kaltoji Šalis įsipareigoja atlyginti nukentėjusiai Šaliai dėl tokios atsakomybės kilimo patirtus tiesioginius nuostolius. GOOTWEET atsakomybė pagal Sutartį visais atvejais ribojama vadovaujantis šiomis nuostatomis:
  10.1.1.	GOOTWEET atsakys tik už tiesioginius nuostolius, patirtus dėl GOOTWEET tyčinio ar dėl didelio neatsargumo padaryto tiesioginio ir esminio šios Sutarties pažeidimo, susijusio su GOOTWEET, kaip platformos operatoriaus, veikla, ir tik už tokius, kuriuos GOOTWEET galėjo protingai numatyti Sutarties pažeidimo metu;
  10.1.2.	GOOTWEET visais atvejais neatsakys už Jūsų negautą pelną ir pajamas, reputacijos praradimą, verslo praradimą ar žlugimą, netiesioginius nuostolius;
  10.1.3.	GOOTWEET neatsako už Platformos veiklos sutrikimus, dėl kurių Jūs negalėjote sudaryti savo pasirinktų sandorių ar Jums pritaikytas priemones pagal Sutarties 9 skyrių „Draudžiami veiksmai“.
  10.2.	GOOTWEET veiksmai jokiais atvejais neapima ir negali būti interpretuojami kaip apimantys šias veiklas:
  10.2.1.	finansinį tarpininkavimą (agento veikla);
  10.2.2.	garantavimą ar kitokį užtikrinimą, kad Pirkėjai sieks pasinaudoti Jūsų Paslaugomis, taip pat kad Pirkėjai, dizaineriai ar kitų paslaugų teikėjai tinkamai vykdys kitus savo prisiimtus įsipareigojimus;
  10.2.3.	mokėjimo paslaugų teikimą ir (ar) elektroninių pinigų leidimą;
  10.2.4.	teisinių paslaugų teikimą;
  10.3.	GOOTWEET tik administruoja Platformą, todėl GOOTWEET nėra atsakinga ir negali būti laikoma kalta už  trečiųjų asmenų veiksmus ir (ar) neveikimą, dėl kurių kaltės sutriktų naudojimasis Platforma ir/ ar GOOTWEET paslaugomis bei funkcionalumais. Platforma taip pat nėra atsakinga už tokius trečiųjų asmenų veiksmus, dėl kurių sutriktų naudojimasis Platformos paslaugomis bei funkcionalumais. Platforma deda pastangas užtikrinti saugų ir patikimą naudojimąsi Platformos paslaugomis, tačiau Platforma negarantuoja ir negali užtikrinti, kad per Platformą sudaryti sandoriai ar kiti naudotojų susitarimai, paslaugų teikimas vyks nepažeidžiant teisės aktų reikalavimų, kad jie bus vykdomi numatytomis sąlygomis, kad nebus šių susitarimų pažeidimo ar neteisėtų sandorio šalies veiksmų.
  
  11.	INTELEKTINĖ NUOSAVYBĖ
  11.1.	Platforma, tinklalapiai, Sutarties tekstas ir kiti Platformoje patalpinti dokumentai, prekės ženklai ir visos juose esančios intelektinės nuosavybės teisės, įskaitant bet neapsiribojant bet kokiu turiniu, priklauso GOOTWEET. Intelektinės nuosavybės teisės reiškia tokias teises, kaip: prekių ženklai, autorių teisės, domenų vardai, duomenų bazių teisės, dizaino teisės, patentai, Sutarties ir kitų Platformoje patalpintų dokumentų tekstai / turinys ir visos kitos intelektinės nuosavybės teisės, nepriklausomai nuo to, jos registruotos ar ne. Draudžiama jas kopijuoti, imituoti ar naudoti be GOOTWEET išankstinio rašytinio sutikimo.
  11.2.	Platformoje pateikiamą medžiagą, informaciją, turinį galima kopijuoti, parsisiųsti, saugoti, atgaminti, atspausdinti ar kitaip naudoti tik asmeniniais tikslais ir tik tiek, kiek susiję su Platformos ir GOOTWEET teikiamų paslaugų naudojimu.
  11.3.	Niekas šioje Sutartyje nesuteikia Jums teisės į Platformą ir / ar interneto svetainę, išskyrus tik tas teises, kurios reikalingos paslaugoms gauti.
  11.4.	Platforma pateikiama tokia, kokia yra be jokių tiesioginių ar numanomų, ar įstatymais garantuotų teisių ar garantijų. GOOTWEET negarantuoja, kad Platformos veikimas bus nenutrūkstamas arba be klaidų. GOOTWEET neatsako už bet kokius paslaugų nutraukimus, įskaitant bet neapsiribojant, Platformos gedimus ar kitus sutrikimus, kurie gali turėti įtakos Paslaugų teikimo sandorių sudarymui. Platforma nesuteikia garantijų dėl Platformos turinio ar rezultatų, kuriuos Rangovas ar kiti naudotojai nori pasiekti (pavyzdžiui, pardavimo apyvartų ir pan.). Atitinkamai, Platforma turi teisę sumažinti ar padidinti tam tikrų Platformos funkcionalumų turinį, diegti keitimus. Rangovas neturi teisės reikšti reikalavimų ar pretenzijų dėl Platformos veikimo, jos turinio ar funkcionalumo, kaip nurodyta šiame punkte.
  
  12.	BAIGIAMOSIOS NUOSTATOS
  12.1.	Kiekviena Šalis patvirtina, kad ji turi visus pagal taikytinus teisės aktus reikalingus leidimus ir licencijas atlikti veiksmus, reikalingus šios Sutarties vykdymui.
  12.2.	Jūs neturite teisės perduoti teisių ir pareigų, kylančių iš šios Sutarties be išankstinio raštiško GOOTWEET sutikimo.
  12.3.	Jei kuri nors Sutarties nuostata pripažįstama negaliojančia, likusios Sutarties nuostatos nenustoja galioti.
  12.4.	Sutarčiai taikoma Lietuvos Respublikos teisė.
  12.5.	Visi ginčai tarp Jūsų ir GOOTWEET sprendžiami derybų keliu. Nepasiekus sutarimo, ginčas sprendžiamas teisme, kurio kompetencijai toks ginčas būtų priskiriamas vadovaujantis Lietuvos Respublikos teisės aktais ir GOOTWEET buveinės registracijos adresu.
  
  `;

  gotoSenderProfile(sender) {
    const user = "manufacturer";
    this.designerUid = sender;
    window.open(
      `${this.baseUrl}/profile/designer/${this.designerUid}`,
      "_blank"
    );
  }

  async openOption(event: any, designerUid: string, index: number) {
    let data = {
      myUid: this.manufacturerUid,
      designerUid: designerUid,
      vip: false,
      vipOption: false,
    };
    let menu = await this.popoverController.create({
      component: OptionPage,
      event: event,
      componentProps: data,
      translucent: true,
      mode: "ios",
    });
    menu.onDidDismiss().then((response: any) => {
      const data = response?.data;
      if (response && data) {
        if (data.remove && data?.m_uid && data?.d_uid) {
          this.showAlert(
            "Confirmation",
            "Want to disconnect?",
            data?.m_uid,
            data?.d_uid,
            index
          );
        }
      }
    });
    return menu.present();
  }
  async showAlert(
    header: string,
    message: string,
    m_uid: string,
    d_uid: string,
    index: number
  ) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: header,
      message: message,
      mode: "ios",
      buttons: [
        {
          text: "Atšaukti",
          handler: () => {
            this.alertController.dismiss();
          },
        },
        {
          text: "Patvirtinti",
          handler: () => {
            this.alertController.dismiss();
            this.httpService
              .removeDesigner(m_uid, d_uid)
              .pipe(first())
              .subscribe((res: any) => {
                console.log(res);
                if (res.status) {
                  this.util.showToast("Removed", "danger");
                  this.designerRequestService.connectedDesigner.splice(
                    index,
                    1
                  );
                }
              });
          },
        },
      ],
    });
    alert.present();
  }

  gotoProfile(owner: any) {
    this.gotoProfileService.gotoProfile(owner);
  }

  back() {
    this.navController.back();
  }
}
