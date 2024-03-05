import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-terms-condition",
  templateUrl: "./terms-condition.page.html",
  styleUrls: ["./terms-condition.page.scss"],
})
export class TermsConditionPage implements OnInit {
  @Input() isModal = false;
  type = 1;
  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private modalCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.type = this.navParams.get("type");
    this.isModal = this.navParams.get("isModal");
  }

  async dismiss() {
    if (this.isModal) await this.modalCtrl.dismiss();
    else this.nav.back();
  }

  terms = `PLATFORMOS Gootweet NAUDOJIMOSI SĄLYGOS
  PREKIŲ IR PASLAUGŲ PIRKĖJAMS
  
  1.	BENDROSIOS NUOSTATOS 
  1.1.	Ši Sutartis sudaroma tarp UAB „Gootweet“, juridinio asmens kodas 305567922, („Gootweet“) kuri yra socialinės-komercinės platformos „Gootweet“ (toliau – Platforma) administratorius, ir Jūsų – per Platformą platinamų prekių („Prekės“) ir/ar paslaugų pirkėjo („Pirkėjas“). Šia Sutartimi yra nustatomos Jūsų teisės ir pareigos Jums registruojantis Platformoje, naudojantis Platformoje teikiamomis paslaugomis ir suteiktomis galimybėms, taip pat Sutarties šalių atsakomybė, Platformos veikimo principai, naudojimosi ja sąlygos bei tvarka. Sutarties priedais, susitarimais, taisyklėmis Jūsų atžvilgiu gali būti nustatomos atskirų paslaugų teikimo sąlygos, specialios šalims taikomos teisės ir pareigos, kurios yra skelbiamos Platformoje arba atskirai pasirašomos tarp šalių.
  1.2.	Ši Sutartis įsigalioja Jums patvirtinus ją registracijos Platformoje metu (nebent būtų susitarta kitaip). Jums patvirtinus atskirus Sutarties priedus, susitarimus, taisykles, jų sąlygos įsigalioja nuo jų patvirtinimo momento ir yra neatsiejama Sutarties dalis. Neatsiejama Sutarties dalis yra ir Platformoje skelbiamos atskiros paslaugų teikimo sąlygos (pavyzdžiui, standartinės sutarčių sąlygos dėl Prekių įsigijimo, dėl dizainerio paslaugų ar kitų paslaugų, kuriomis Pirkėjas naudojasi per Platformą, privatumo politika) ir kiti dokumentai, į kuriuos šia Sutartimi pateikiamos nuorodos arba kuriuos Gootweet pateikia Pirkėjui registracijos ar Sutarties vykdymo metu. Gootweet turi teisę reikalauti, kad tam tikri Sutarties priedai, susitarimai, taisyklės tarp šalių būtų sudaryti ir pasirašyti raštu; ir, tokiu atveju, jie įsigalios tik nuo jų pasirašymo momento. 
  1.3.	Jeigu šios Sutarties prieduose, atskirų paslaugų teikimo sąlygose bus nurodytos kitokios nuostatos nei šioje Sutartyje, turi būti vadovaujamasi ir pirmumas bus teikiamas Sutarties priedų, atskirų paslaugų teikimo sąlygų nuostatoms. 
  1.4.	Prieš registruodamasis Platformoje bei patvirtindamas šią Sutartį, Jūs turite atidžiai perskaityti Sutartį, susipažinti su Privatumo politika ir su visais Jums taikomais Sutarties priedais, susitarimais ar taisyklėmis bei atlikti kitus registracijos metu nurodytus veiksmus. 
  
  2.	PLATFORMA
  2.1.	Platforma yra skirta Prekių tiekėjams sudaryti galimybę siūlyti ir parduoti savo gaminamas / platinamas prekes, o Pirkėjų (pirkėjų) atžvilgiu – palengvinti reikalingų prekių ar paslaugų įsigijimą, sukurti malonią pirkimo patirtį, t.y. suvesti Pirkėjus, kurie siekia įsigyti prekę ir/ar gauti interjero, stiliaus ar kitos srities dizaino paslaugą, su atitinkamų ieškomų prekių ar paslaugų tiekėjais bei sudaryti galimybę nurodytoms šalims patogiai ir greitai komunikuoti; sudaryti atitinkamus sandorius dėl prekių ar paslaugų įsigijimo; inicijuoti atsiskaitymą; derinti prekių pristatymą ir atlikti kitus prekybinius/ paslaugų teikimo veiksmus.
  2.2.	Platformos paslaugų naudotojai yra šie:
  2.2.1.	Prekių tiekėjai. Prekių tiekėjais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais siekia per Platformą parduoti savo gaminamas ar platinamas prekes. 
  2.2.2.	Pirkėjai. Šioje Sutartyje Platformos Pirkėjais yra įvardijami pilnamečiai fiziniai ar juridiniai asmenys, kurie savo asmeniniais tikslais arba verslo poreikiams siekia per Platformą įsigyti Prekių tiekėjo siūlomas prekes ir/ar susijusias Platformoje siūlomas paslaugas. Pirkėjo registracijos Platformoje tvarka ir reikalavimai Pirkėjams nurodyti šios Sutarties 3 skyriuje.
  2.2.3.	Dizaineriai. Dizaineriais yra įvardijami fiziniai ar juridiniai asmenys, kurie verslo tikslais bendradarbiauja su Prekių pardavėju(ais) ir siūlo Pirkėjams dizaino konsultacijų paslaugą, kurios metu būtų derinamos / naudojamos atitinkamo Prekių pardavėjo siūlomos (parduodamos) Prekės.
  2.2.4.	Rangos paslaugų teikėjai. Rangos paslaugų teikėjais yra įvardijami fiziniai ar juridiniai asmenys, kuriems yra sudaryta galimybė Platformoje nustatyta tvarka pateikti pasiūlymą Pirkėjui dėl jo įsigytos Prekės sumontavimo, įrengimo ar dėl kitos susijusios rangos paslaugos.
  2.3.	Pirkėjo atžvilgiu Gootweet teikia Platformos administravimo paslaugas ir atlieka šias funkcijas: (a) suteikia galimybę Pirkėjams per Platformą įsigyti joje siūlomas Prekes, taip pat su jų naudojimu susijusias paslaugas (dizaino, rangos, kt.), t.y. sudaryti Prekių pirkimo sandorius; (b) atlieka atitinkamo Pirkėjo identifikavimą, vertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles; (c) organizuoja Pirkėjo atsiskaitymą su Prekių tiekėju už įsigyjamas Prekes ir/ar paslaugas; (d) skelbia informaciją apie Prekių užsakymų vykdymo eigą; suteikia galimybę pareikšti atsiliepimus, komentarus ar nusiskundimus dėl atitinkamo Prekių tiekėjo; (e) atstovauja ir gina Platformos naudotojų interesus Platformos ribose (t.y. atlieka veiksmus, siekiant, kad Platforma nebūtų naudojama neteisėtiems veiksmams, Platformos naudotojų teisių pažeidimui), taip pat atlieka kitas Sutartyje, jos prieduose, per Platformą sudarytuose sandoriuose ir teisės aktuose numatytas funkcijas.
  
  3.	REGISTRACIJA PLATFORMOJE. REIKALAVIMAI PIRKĖJAMS
  3.1.	Jūs, kaip Pirkėjas, norėdamas naudotis Platforma ir jos teikiamomis paslaugomis, turite užsiregistruoti Platformoje, pateikti visus Gootweet prašomus dokumentus ir informaciją, patvirtinti šią Sutartį bei susipažinti su Privatumo politika.
  3.2.	Jūs galėsite rinktis ir įsigyti norimas Prekes bei sudaryti Prekių pirkimo-pardavimo sandorius, tik jeigu tinkamai patvirtinsite savo (savo atstovo) tapatybę Platformoje leidžiamais būdais. Informuojame, kad Jums nepatvirtinus savo tapatybės per 6 mėnesius nuo registravimosi Platformoje dienos, Gootweet turi teisę panaikinti Jūsų paskyrą ir Platformoje turėsite registruotis iš naujo.
  3.3.	Platformoje galite turėti tik vieną aktyvią paskyrą (paskyra gali turėti kelis valdomus sub-domenus). Bet kokios paskesnės registracijos rezultatai ir naujos paskyros gali būti panaikinamos be atskiro įspėjimo.
  3.4.	Šią Sutartį kaip Prekių tiekėjas gali sudaryti tiek fizinis, tiek juridinis asmuo. Ją galite sudaryti tik asmeniškai savo vardu ar savo teisėtai atstovaujamo juridinio asmens vardu. Juridinio asmens vardu Sutartį sudaryti gali tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris turi reikiamus įgaliojimus. Atstovas turi pateikti dokumentus, įrodančius atstovavimo teisę bei teisę sudaryti komercinius sandorius Pirkėjo vardu.
  3.5.	Sudarydamas šią Sutartį, Jūs sutinkate bendradarbiauti su Gootweet, kad Gootweet galėtų nustatyti Jūsų tapatybę (jeigu Jūs esate juridinis asmuo – ir Jūsų atstovų bei, esant poreikiui, ir naudos gavėjų tapatybes), patvirtinti Jūsų kontaktinius duomenis, taip pat sutinkate ir įsipareigojate pateikti visus prašomus dokumentus, informaciją ir paaiškinimus apie savo tapatybę ir vykdomą veiklą. 
  3.6.	Jūs visiškai atsakote už savo pateiktos informacijos, duomenų, dokumentų teisingumą ir aktualumą. Jeigu pateiksite neteisingą informaciją, jos laiku neatnaujinsite, dėl ko gali būti pažeisti Jums/ Jūsų atstovui suteikti įgaliojimai, visa atsakomybė už tai tenka Jums/ Jūsų vardu veikusiems asmenims.
  3.7.	Jūs esate informuotas ir sutinkate, kad Gootweet turi teisę savo nuožiūra atsisakyti tvirtinti Jūsų registraciją, tvirtinti Jūsų tapatybę, taip pat turi teisę nustatyti Jums papildomus reikalavimus registracijai ar nustatyti veiklos Platformoje apribojimus, nutraukti šią Sutartį vadovaudamasi Sutarties 9 skyriumi „Draudžiami veiksmai“.
  3.8.	Jūsų ar Jūsų deleguotų atstovų, darbuotojų, naudos gavėjų (jeigu Pirkėjas yra juridinis asmuo) asmens duomenys yra tvarkomi pagal Gootweet Privatumo politiką. Jeigu Jūs esate juridinis asmuo, kaip savo atstovų bei naudos gavėjų duomenų valdytojas, Jūs turite užtikrinti, kad Jūs informavote duomenų subjektus apie jų duomenų pateikimą Gootweet ir jų duomenų tvarkymą, kaip to reikalauja asmens duomenų tvarkymą reglamentuojantys teisės aktai. Tam tikrais atvejais Gootweet gali pareikalauti pateikti originalius raštu pasirašytus sutikimus/ patvirtinimus apie informavimą dėl asmens duomenų tvarkymo iš duomenų subjektų.
  3.9.	Paskyra Platformoje galite naudotis tik pats, o juridinio asmens vardu ja gali naudotis tik juridinio asmens vadovas ar kitas teisėtas atstovas, kuris tam turi įgaliojimus. Visi veiksmai, atlikti Jums prisijungus prie Platformos, bus laikomi atliktais Jūsų paties. Jūs suprantate ir patvirtinate, kad visi Jūsų veiksmai, atlikti Jums prisijungus Platformoje, laikomi tinkamais Jūsų sutikimais ir patvirtinimais, pasirašytais elektroniniu parašu, kaip tą numato Elektroninės atpažinties ir elektroninių operacijų patikimumo užtikrinimo paslaugų įstatymo 5str. 1 d.
  3.10.	Prieš patvirtindama Pirkėjo registraciją, Gootweet turi teisę atlikti atitinkamo Pirkėjo identifikavimą bei įvertinimą pagal Platformos koncepciją, tikslus ir etikos taisykles. Pirkėjas negali būti nepilnametis fizinis asmuo. Gootweet turi teisę savo nuožiūra ir nedetalizuodamas priežasčių nepatvirtinti Pirkėjo registracijos ir kitais pagrindais, jeigu Pirkėjo veikla ir profilis neatitinka Platformos koncepcijos.
  
  4.	PREKIŲ PARDAVIMO SANDORIAI TARP PREKIŲ TIEKĖJŲ IR PIRKĖJŲ
  4.1.	Platformoje yra pateikiamos (siūlomos įsigyti) Gootweet patvirtintų Prekių tiekėjų Prekės, kurias Pirkėjai gali įsigyti per Platformą (toliau – Prekės). 
  4.2.	Platformoje Pirkėjams skelbiama ši pagrindinė informacija apie Prekes: (i) Prekės aprašymas; (ii) Prekės gamintojas (su nuoroda į gamintojo tinklapį); (iii) pagrindinės Prekės savybės; (iii) Prekės kaina; (iv) Prekės nuotrauka ar vizualizacija; kartu gali būti pateikiamos su Preke derančios kitos prekės, detalės; (v) kita informacija, kurią Prekių tiekėjas pageidauja pateikti. Kartu su Preke gali būti siūloma dizainerio paslauga; atitinkamos Prekės montavimo/ rangos (jei aktualu) paslauga arba kitos susijusios paslaugos.
  4.3.	Prekių tiekėjo atliktas Prekės pateikimas (patalpinimas) Platformoje reiškia viešą Prekių tiekėjo pasiūlymą Pirkėjams įsigyti jo siūlomą Prekę. Atitinkamai, Prekių pardavimo sandoriui sudaryti pakanka Pirkėjo patvirtinimo (valios išreiškimo) įsigyti siūlomą Prekę; atskiro patvirtinimo šiam pardavimo sandoriui iš Prekių tiekėjo pusės nereikia. Pirkėjas Prekių įsigijimo sandorį sudaro prisijungdamas prie Platformos savitarnos sistemos ir atlikdamas joje patvirtinimus, vadovaudamasis joje pateiktais pasirinkimais ir veiksmų seka. Pirkėjui patvirtinus Prekės įsigijimo sandorį, Platforma Prekių tiekėjo vardu sugeneruoja ir pateikia Pirkėjui sąskaitą už pasirinktas Prekes (ir paslaugas, jei taikoma). 
  4.4.	Prekės pardavimo sandoris laikomas sudarytu nuo to momento, kai atliekami šie visi veiksmai: (i) Pirkėjas per savo paskyrą pasirenka Prekę, patvirtina suformuotą Prekės užsakymą ir atlieka Prekės kainos apmokėjimą; o (ii) Platforma Prekės pardavėjo vardu patvirtina (priima) Prekės užsakymą, Prekės pardavėjas patvirtina Prekės kainos mokėjimo gavimą bei šio užsakymo priėmimą vykdyti.   
  4.5.	Prekės pardavimo sandoriu Pirkėjas įsipareigoja Prekių tiekėjui apmokėti Prekės kainą ir priimti pristatomą įsigytą Prekę ir/ar paslaugą, o Prekių tiekėjas įsipareigoja Pirkėjui:
  4.5.1.	Perduoti Pirkėjui nuosavybės teisę į Prekę;
  4.5.2.	Nedelsiant informuoti Pirkėją tuo atveju, jeigu Prekių tiekėjas patvirtintos ir/ar apmokėtos Prekės nebeturi ir pasiūlyti kitą Prekę, o Pirkėjui nepageidaujant kitos Prekės – grąžinti jam sumokėtą Prekės kainą;
  4.5.3.	Pristatyti Prekę Pirkėjo nurodytu adresu;
  4.5.4.	Atsižvelgiant į Prekės tipą, suteikti Prekės naudojimo garantiją, kuri būtų ne mažesnės apimties negu to reikalauja įstatymai;
  4.5.5.	Užtikrinti Prekės priėmimo, jos pakeitimo ar jos kainos grąžinimo sąlygas tuo atveju, kai Pirkėjas teisėtai ją sieks grąžinti, vadovaudamasis Platformos taisyklėmis ir Lietuvos Respublikos civilinio kodekso 6.22810 ir 6.22811 straipsniais (kai Prekė įsigyta asmeninio vartojimo poreikiams) ar kitais taikytinais teisės aktais;
  4.5.6.	Užtikrinti Pirkėjo galimybę pasinaudoti jam įstatymų ar sutarties suteiktomis teisėmis ir gynimo priemonėmis.
  Standartinės sąlygos, kuriomis Pirkėjas įsigyja Prekių tiekėjo parduodamas Prekes, yra pridedamos kaip neatsiejama šios Sutarties dalis („Prekių įsigijimo sandoris“ arba „Prekių pardavimo sandoris“). Patvirtindamas šią Sutartį, Jūs patvirtinate šias standartines Prekių įsigijimo sandorio sąlygas ir sutinkate, kad Jūsų įsigyjamos Prekės būtų perkamos būtent šių sąlygų pagrindu.
  4.6.	Patvirtindamas šią Sutartį, Jūs pavedate Gootweet be atskiro įgaliojimo, kiek tai reikalinga Prekių įsigijimo sandorių sudarymui ir vykdymui, Jūsų vardu ir interesais Platformoje patvirtinti Jūsų pasirinktų Prekių įsigijimą, pateikti ir patvirtinti pirkimo užsakymus dėl Prekių įsigijimo. Jūs sutinkate, kad Gootweet prašymu, Jūs pateiksite teisės aktuose nustatytos formos įgaliojimą šiems aukščiau nurodytiems veiksmams atlikti. Šalys susitaria ir patvirtina, jog šiame punkte numatytas teisių ir įgaliojimų suteikimas Platformai yra esminė Sutarties įgyvendinimo ir Platformos veikimo sąlyga. Atitinkamai, bet koks Pirkėjo pareiškimas dėl šių teisių ir įgaliojimų atšaukimo bus laikomas Sutarties nutraukimu dėl Pirkėjo kaltės.
  4.7.	Pirkėjas patvirtina, kad jis yra informuotas apie tai, kad Pirkėjui patvirtinus pasirinktas Prekes ir/ar jas apmokėjus, Prekių tiekėjas turi teisę patikslinti informaciją apie prekių likutį ir informuoti Pirkėją jei atitinkamos Prekės jis nebegamina, nebeturi ar atsisako teikti. Jeigu Pirkėjas patvirtina Prekės pirkimo sandorį ir apmoka Prekės kainą, tačiau po šių veiksmų paaiškėja, kad Prekių tiekėjas atitinkamos Prekės negalės pateikti – Prekių tiekėjas nedelsiant apie tai informuoja Pirkėją ir Platformą bei grąžina jam atitinkamos Prekės kainą. Prieš grąžindamas Prekės kainą, Prekių tiekėjas turi teisę pateikti Pirkėjui analogiškos Prekės pasiūlymą.
  
  5.	KOMUNIKACIJA
  5.1.	Jūs turite pateikti Platformai savo (atstovo) telefono numerį, gyvenamosios vietos / buveinės adresą ir elektroninio pašto adresą bei juos patvirtinti. Jūs sutinkate, kad Jūsų pateiktas telefono numeris ir elektroninio pašto adresas, taip pat vidinės Platformos komunikavimo priemonės (pokalbių langai, pranešimai ir pan.) bus naudojami Platformos bendravimui su Jumis, t.y. teikiant informaciją apie Sutartis ar kitas Jums taikomas sąlygas, jų pasikeitimus, įsigaliojimo sąlygas, naujoves, kitą svarbią informaciją. Informacija taip pat bus skelbiama Platformoje. 
  5.2.	Jūs turite nedelsdamas informuoti Platformą apie savo kontaktinės informacijos pasikeitimą atnaujindamas šią informaciją Platformos paskyroje. Gootweet vadovaujasi paskutine žinoma informacija apie Jus ir laiko ją teisinga, todėl Gootweet neatsako, jeigu negausite informacijos laiku dėl to, kad neatnaujinote savo kontaktinės informacijos ir atitinkamai dėl to patirsite nuostolius.
  
  6.	SUTARTIES PAKEITIMAS
  6.1.	Gootweet turi teisę vienašališkai keisti ir (arba) papildyti Sutartį, jos priedus, apie tai informuodama Jus skyriuje „Komunikacija“ numatytais būdais.
  6.2.	Apie mokesčių dydžio, jų įvedimo, mokėjimo tvarkos, Privatumo politikos pasikeitimus Jūs būsite informuojamas 30 kalendorinių dienų iki pasikeitimų įsigaliojimo. Apie kitus Jums taikomus sąlygų pasikeitimus būsite informuojamas ne vėliau nei sąlygų pasikeitimo dieną.
  6.3.	Jūsų naudojimasis Platforma po Sutarties ar jos atskirų sąlygų, priedų pakeitimo reiškia Jūsų sutikimą su Sutarties pakeitimu.
  6.4.	Jūs neturite teisės vienašališkai keisti šios Sutarties, jos priedų sąlygų.
  
  7.	SUTARTIES NUTRAUKIMAS
  7.1.	Ši Sutartis gali būti nutraukta Šalių susitarimu.
  7.2.	Jūs turite teisę nutraukti šią Sutartį įspėjęs apie tai Gootweet prieš 30 dienų, jei Sutarties nutraukimo metu neturite neįvykdytų Prekių pardavimo sandorių ir/ar neįvykdytų atsiskaitymų Platformai ir/ar Prekių tiekėjui / paslaugų teikėjui.
  7.3.	Gootweet turi teisę nutraukti šią Sutartį be įspėjimo Sutarties 9 skyriuje „Draudžiami veiksmai“ numatytais atvejais, taip pat jei Gootweet su Jumis nutraukia Sutartį kitais Sutartyje numatytais atvejais.
  7.4.	Nutraukus šią Sutartį, yra panaikinama Jūsų paskyra Platformoje, tačiau duomenys apie Jus, apie Jūsų sudarytus Prekių įsigijimo sandorius toliau yra saugomi Privatumo politikoje ir teisės aktuose nustatytais tikslais, terminais ir tvarka.
  7.5.	Gootweet likvidavimo ar bankroto atveju Prekių pardavimo sandoriai lieka galioti ir jų šalių turi būti įgyvendinami taip, lyg būtų sudaryti Gootweet nedalyvaujant.
  
  8.	DRAUDŽIAMI VEIKSMAI
  8.1.	Naudojantis Platforma draudžiama:
  8.1.1.	pažeisti šią Sutartį, Prekių įsigijimo sandorius, kitus tarp šalių sudarytus susitarimus, teisės aktus;
  8.1.2.	naudotis Platforma bet kokiems neteisėtiems tikslams, įskaitant bet neapsiribojant: sukčiavimui, pinigų plovimui, teroristų finansavimui, neteisėtam finansinių paslaugų teikimui, nesąžiningai konkurencijai, kt.
  8.1.3.	pateikti Gootweet neteisingą ar klaidingą informaciją, neteikti Gootweet prašomos informacijos, dokumentų, jos laiku neatnaujinti;
  8.1.4.	veikti Platformoje trečių asmenų vardu ir/ ar naudai, tokio veikimo neatskleidžiant;
  8.1.5.	skleisti kompiuterinius virusus ar imtis kitų veiksmų, kurie gali sukelti Platformos veikimo sutrikimus, pažeidimus ar sukelti kitą žalą Gootweet;
  8.1.6.	perduoti arba įvesti į Platformą duomenis, kuriuose galėtų būti programinės įrangos virusų, ar bet kokį kitą kodą, failus ar programas, skirtas trukdyti, riboti arba sugadinti Platformos arba jos įrangos, programinės įrangos ar ryšio įrangos funkcijas, įskaitant programas, kurios automatiškai sektų, naudotų ir/ ar išsaugotų Platformoje esančią/ pateikiamą informaciją;
  8.1.7.	naudoti kitas sistemas prisijungiant prie Platformos ar ja naudojantis;
  8.1.8.	skatinti ir/ ar reklamuoti kitas identiškas ar panašaus pobūdžio paslaugas ar platformas;
  8.1.9.	atskleisti savo prisijungimo prie Platformos duomenis bet kokiems tretiesiems asmenims, naudotis trečiųjų asmenų slaptažodžiais ir kitais prisijungimo duomenimis;
  8.1.10.	sudaryti Prekių įsigijimo sandorius pažeidžiant Jums taikomus teisės aktus, sudarytas sutartis, susitarimus ar teismų sprendimus; juridinio asmens atveju – ir Jūsų vidaus dokumentus, Jums suteiktus įgaliojimus, leidimus;
  8.1.11.	atlikti bet kokius veiksmus, kurie gali kelti riziką Gootweet.
  8.2.	Jei Gootweet turi įtarimą, kad atlikote draudžiamus veiksmus, Gootweet gali imtis veiksmų, kad apsaugotų savo, Jūsų ar trečiųjų asmenų interesus, kaip pavyzdžiui:
  8.2.1.	uždaryti ar apriboti prisijungimą prie Jūsų paskyros;
  8.2.2.	apriboti Jūsų veiklą Platformoje, nustatyti Prekių įsigijimo limitus;
  8.2.3.	neleisti sudaryti Prekių įsigijimo sandorių ar juos nutraukti;
  8.2.4.	informuoti apie Jūsų veiklą kompetentingas valstybines institucijas;
  8.2.5.	nutraukti šią Sutartį be išankstinio įspėjimo;
  8.2.6.	imtis kitų teisinių priemonių.
  8.3.	Gootweet pritaikius šiame skyriuje numatytas priemones, Jūs neturite teisės reikalauti žalos atlyginimo.
  
  9.	ATSAKOMYBĖ
  9.1.	Kiekviena Šalis yra atsakinga už visas baudas, netesybas, nuostolius, kylančius kitai Šaliai dėl kaltosios Šalies padaryto Sutarties pažeidimo. Kaltoji Šalis įsipareigoja atlyginti nukentėjusiai Šaliai dėl tokios atsakomybės kilimo patirtus tiesioginius nuostolius. Gootweet atsakomybė pagal Sutartį visais atvejais ribojama vadovaujantis šiomis nuostatomis:
  9.1.1.	Gootweet atsakys tik už tiesioginius nuostolius, patirtus dėl Gootweet tyčinio ar dėl didelio neatsargumo padaryto tiesioginio ir esminio šios Sutarties pažeidimo, susijusio su Gootweet, kaip platformos operatoriaus, veikla, ir tik už tokius, kuriuos Gootweet galėjo protingai numatyti Sutarties pažeidimo metu;
  9.1.2.	Gootweet visais atvejais neatsakys už Jūsų negautą pelną ir pajamas, reputacijos praradimą, verslo praradimą ar žlugimą, netiesioginius nuostolius;
  9.1.3.	Gootweet neatsako už Platformos veiklos sutrikimus, dėl kurių Jūs negalėjote sudaryti savo pasirinktų Prekių pardavimo sandorių ar Jums pritaikytas priemones pagal Sutarties 9 skyrių „Draudžiami veiksmai“.
  9.2.	Gootweet veiksmai jokiais atvejais neapima ir negali būti interpretuojami kaip apimantys šias veiklas:
  9.2.1.	finansinį tarpininkavimą (agento veikla);
  9.2.2.	garantavimą ar kitokį užtikrinimą, kad Prekių tiekėjai, dizaineriai ar kitų paslaugų teikėjai tieks Prekes ar tinkamai vykdys kitus savo prisiimtus įsipareigojimus Pirkėjo atžvilgiu;
  9.2.3.	mokėjimo paslaugų teikimą ir (ar) elektroninių pinigų leidimą;
  9.2.4.	teisinių paslaugų teikimą.
  9.3.	Gootweet tik administruoja Platformą, todėl Gootweet nėra atsakinga ir negali būti laikoma kalta už  trečiųjų asmenų veiksmus ir (ar) neveikimą, dėl kurių kaltės sutriktų naudojimasis Platforma ir/ ar Gootweet paslaugomis bei funkcionalumais. Platforma taip pat nėra atsakinga už tokius trečiųjų asmenų veiksmus, dėl kurių sutriktų naudojimasis Platformos paslaugomis bei funkcionalumais. Platforma deda pastangas užtikrinti saugų ir patikimą naudojimąsi Platformos paslaugomis, tačiau Platforma negarantuoja ir negali užtikrinti, kad per Platformą sudaryti sandoriai ar kiti naudotojų susitarimai, paslaugų teikimas vyks nepažeidžiant teisės aktų reikalavimų, kad jie bus vykdomi numatytomis sąlygomis, kad nebus šių susitarimų pažeidimo ar neteisėtų sandorio šalies veiksmų.
  
  10.	INTELEKTINĖ NUOSAVYBĖ
  10.1.	Platforma, tinklalapiai, Sutarties tekstas ir kiti Platformoje patalpinti dokumentai, prekės ženklai ir visos juose esančios intelektinės nuosavybės teisės, įskaitant bet neapsiribojant bet kokiu turiniu, priklauso Gootweet. Intelektinės nuosavybės teisės reiškia tokias teises, kaip: prekių ženklai, autorių teisės, domenų vardai, duomenų bazių teisės, dizaino teisės, patentai, Sutarties ir kitų Platformoje patalpintų dokumentų tekstai / turinys ir visos kitos intelektinės nuosavybės teisės, nepriklausomai nuo to, jos registruotos ar ne. Draudžiama jas kopijuoti, imituoti ar naudoti be Gootweet išankstinio rašytinio sutikimo.
  10.2.	Platformoje pateikiamą medžiagą, informaciją, turinį galima kopijuoti, parsisiųsti, saugoti, atgaminti, atspausdinti ar kitaip naudoti tik asmeniniais tikslais ir tik tiek, kiek susiję su Platformos ir Gootweet teikiamų paslaugų naudojimu.
  10.3.	Niekas šioje Sutartyje nesuteikia Jums teisės į Platformą ir / ar interneto svetainę, išskyrus tik tas teises, kurios reikalingos paslaugoms gauti.
  10.4.	Platforma pateikiama tokia, kokia yra be jokių tiesioginių ar numanomų, ar įstatymais garantuotų teisių ar garantijų. Gootweet negarantuoja, kad Platformos veikimas bus nenutrūkstamas arba be klaidų. Gootweet neatsako už bet kokius paslaugų nutraukimus, įskaitant bet neapsiribojant, Platformos gedimus ar kitus sutrikimus, kurie gali turėti įtakos Prekių pardavimo sandorių sudarymui. Platforma nesuteikia garantijų dėl Platformos turinio ar rezultatų, kuriuos Pirkėjai ar kiti naudotojai nori pasiekti (pavyzdžiui, atitinkamos Prekės įsigijimo ir pan.). Atitinkamai, Platforma turi teisę sumažinti ar padidinti tam tikrų Platformos funkcionalumų turinį, diegti keitimus. Pirkėjas neturi teisės reikšti reikalavimų ar pretenzijų dėl Platformos veikimo, jos turinio ar funkcionalumo, kaip nurodyta šiame punkte.
  
  11.	BAIGIAMOSIOS NUOSTATOS
  11.1.	Kiekviena Šalis patvirtina, kad ji turi visus pagal taikytinus teisės aktus reikalingus leidimus ir licencijas atlikti veiksmus, reikalingus šios Sutarties vykdymui.
  11.2.	Jūs neturite teisės perduoti teisių ir pareigų, kylančių iš šios Sutarties, Prekių įsigijimo sandorių tretiesiems asmenims be išankstinio raštiško Prekių tiekėjo sutikimo.
  11.3.	Jei kuri nors Sutarties nuostata pripažįstama negaliojančia, likusios Sutarties nuostatos nenustoja galioti.
  11.4.	Sutarčiai, Prekių pardavimo sandoriams taikoma Lietuvos Respublikos teisė.
  11.5.	Visi ginčai tarp Jūsų ir Gootweet sprendžiami derybų keliu. Nepasiekus sutarimo, ginčas sprendžiamas teisme, kurio kompetencijai toks ginčas būtų priskiriamas vadovaujantis Lietuvos Respublikos teisės aktais ir Gootweet buveinės registracijos adresu.
  
  UAB  Gootweet 
  Registracijos kodas:: 305567922
  PVM: LT100013362316
  Adresas: Žirmūnų g. 3-8, Kintai, LT-99358 Šilutės r.

  info@gootweet.com

  `;

  termsBottom = `
  <b>1. Gootweet.com</b>

  UAB  Gootweet 
  Registracijos kodas:: 305567922
  PVM: LT100013362316
  Adresas: Žirmūnų g. 3-8, Kintai, LT-99358 Šilutės r.

  info@Gootweet.com

 <b>2. Projekto aprašymas</b>

  UAB Gootweet administruoja internetinę platformą (Social marketplace), kurioje vartotojai galėtų įsigyti prekių bei užsisakyti ir gauti interjero, stiliaus ar kitos srities dizaino paslaugą, kartu su reikalingomis prekėmis (t.y. atitinkamų prekių ženklų savininkų gaminiais); taip pat galėtų gauti pasiūlymą dėl šių įsigyjamų ir dizainerio parinktų prekių montavimo, įrengimo ar kitų susijusių paslaugų (jei tokios yra reikalingos, norint naudotis įsigyjama preke).    

  UAB „Gootweet“ veikia tik kaip platformos administratorius, tačiau neprisiima rizikos ar atsakomybės dėl joje siūlomų prekių ar paslaugų kokybės, neorganizuoja pristatymo ar garantinio aptarnavimo. Jo funkcija – išimtinai tarpininko.

  <b>3. Pristatymo sąl.</b>
  
  Per platformą platinamų Prekių pardavėjai, prekių pardavimo sutartimi (pagal standartinę platformoje paskelbtą formą) be kita ko įsipareigoja:  Pristatyti Prekę Pirkėjo nurodytu adresu.
  Taigi, dėl pristatymo šalys susitaria tiesiogiai.

  Prekių pardavimo sutartyje nustatyta:

  7.          PREKĖS PRISTATYMAS
  7.1.       Prekės pristatomos į bet kurią Lietuvos vietą. Sandėliuose esančios prekės pristatomos per 2-5 darbo dienas nuo apmokėjimo patvirtinimo (patvirtinus apmokėjimą, užsakymo būklė sistemoje pasikeičia į "Užsakymas vykdomas"). Prekės pristatymo paslaugas atliks Pardavėjo samdomi kurjeriai.
  7.2.       Prekės pristatomos darbo dienomis pagal kurjerių tarnybos darbo laiką. Prekės pristatymo adresas turi būti nurodomas atsižvelgiant į Pirkėjo galimybę priimti Prekę.
  7.3.       Pirkėjas privalo apžiūrėti Prekes jų gavimo momentu, paliekant pastabą(-as) apie užfiksuotus pažeidimus (jei tokių yra) Prekės pirkimo ar/ir perdavimo dokumentuose, dalyvaujant siuntų tarnybos atstovui (kurjeriui), o aptikus siuntos bei prekių pažeidimų, pažymėti siuntos perdavimo–priėmimo dokumente bei užpildyti pakuotės (siuntos) pažeidimo aktą arba atsisakyti priimti siuntą, informuojant Pardavėją apie įvykį per 24 val.
  7.4.       Jei Pirkėjas, priimdamas Prekes, nepalieka pastabų ir neužpildo pakuotės (siuntos) pažeidimo akto, bei neinformuoja Pardavėjo apie pažeidimus, laikoma, kad perduotos Prekės neturėjo pastebimų pažeidimų (trūkumų) už kuriuos atsako Pardavėjas, kadangi Pardavėjas neprivalo garantuoti, kad Prekė(-ės) neturi paslėptų trūkumų, jeigu Pirkėjas žino apie juos arba jie yra tiek akivaizdūs, kad bet koks atidus pirkėjas būtų juos pastebėjęs be jokio specialaus tyrimo ar įrangos (LR CK 6.333 str.).

  <b>4. Grąžinimas</b>

  Per platformą platinamų Prekių pardavėjai, prekių pardavimo sutartimi (pagal standartinę platformoje paskelbtą formą) be kita ko įsipareigoja:

  Užtikrinti Prekės priėmimo, jos pakeitimo ar jos kainos grąžinimo sąlygas tuo atveju, kai Pirkėjas teisėtai ją sieks grąžinti, vadovaudamasis Platformos taisyklėmis ir Lietuvos Respublikos civilinio kodekso 6.22810 ir 6.22811 straipsniais (kai Prekė įsigyta asmeninio vartojimo poreikiams) ar kitais taikytinais teisės aktais.


  Prekių pardavimo sutartyje nustatyta:
  9.          PREKIŲ GRĄŽINIMAS IR KEITIMAS
  9.1.       Prekių grąžinimas vyksta vadovaujantis 2001 m. birželio 11d. Lietuvos Respublikos Vyriausybės nutarimu Nr. 697 patvirtintomis „Mažmeninės prekybos taisyklėmis".
  9.2.       Grąžinama Prekė privalo būti pilnai sukomplektuota, su visais gamintojo pridedamais dokumentais, tvarkingai supakuota originalioje nepažeistoje pakuotėje su visomis originaliomis (ir pakavimo) medžiagomis bei nepažeistu ženklinimu. Už pilną Prekės sukomplektavimą ir supakavimą atsako Pirkėjas. Prekė turi būti nepraradusi prekinės išvaizdos: nepažeistos etiketės, nenuplėštos apsauginės plėvelės ir kt. (pastarasis reikalavimas nėra taikomas, jei grąžinama nekokybiška prekė). Nesilaikant nurodytų reikalavimų, Pardavėjas turi teisę nepriimti Prekės.
  9.3.       Grąžinant Prekę, būtina pateikti jos įsigijimo dokumentą bei prašymą grąžinti Prekę.
  9.4.       Įstatymų numatyta tvarka Pardavėjas įsipareigoja grąžinti pinigus tik po to, kai jis įsitikina ir patvirtina, kad Prekė yra tinkamos būklės, t.y. nenustatyta pažeidimų, sugadinimų, nepakeistos detalės, sutampa pirktos ir grąžintos Prekės serijinis numeris ir pan.
  9.5.       Prekės grąžinamos Pirkėjo sąskaita, išskyrus atvejus, kai grąžinama gauta ne ta Prekė ar kai pristatyta Prekė yra nekokybiška.
  9.6.       Pirkėjas, norėdamas atsisakyti įsigytų Prekių (pagal sutarties 3.1 punktą) ir pateikęs tokį prašymą Pardavėjui, privalo per 14 d. savo sąskaita pristatyti grąžinamas Prekes į Pardavėjo atstovybę, o Pardavėjas, per 14 dienų nuo prekių gavimo privalo jas patikrinti ir, nenustačius Prekių grąžinimo sąlygų pažeidimų, grąžinti Pirkėjui už Prekes sumokėtus pinigus. Jei užfiksuota Prekių grąžinimo sąlygų pažeidimų, Pardavėjas privalo informuoti apie tai Pirkėją ir pasiūlyti atsiimti negalimas grąžinti Prekes. Prekės gali būti pristatomos Pirkėjo nurodytu adresu, jei Pirkėjas pageidauja apmokėti Prekių pristatymo išlaidas. Neatsiėmus prekių per 14 d. nuo Pardavėjo atsakymo gavimo, taikomas Prekės saugojimo mokestis (1% prekės vertės už kiekvieną pradelstą dieną). Neatsiėmus prekių per 100 d. nuo saugojimo mokesčio skaičiavimo dienos, Prekės nuosavybės teisė pereina Pardavėjui ir jis turi teisę Prekių nebesaugoti ir jas utilizuoti.


  `;
}
