import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BottomNavService {
  private tabs = [
    {
      src: "assets/img/home.svg",
      name: "Titulinis",
      route: "home",
      selected: true,
      visible: true,
    },
    {
      src: "assets/img/video.svg",
      name: "Titulinis",
      route: "/gootweet-tube",
      selected: false,
      visible: true,
    },
    {
      name: "E-prekyba",
      src: "assets/img/products.svg",
      route: "filter/search/all/products",
      selected: false,
      visible: true,
    },
    {
      src: "assets/img/love.svg",
      name: "Titulinis",
      route: "home",
      selected: false,
      visible: true,
    },

    {
      name: "Pranešimai",
      src: "assets/img/notifications.svg",
      route: "notifications",
      selected: false,
      visible: true,
    },
    {
      src: "assets/img/category.svg",
      name: "Kategorijos",
      route: "filter/mobile-category",
      selected: false,
      visible: false,
    },
    {
      src: "assets/img/add-cart.svg",
      name: "Krepšelis",
      route: "cart",
      selected: false,
      visible: false,
    },
    // {
    //   src:'',
    //   name: "Dalyviai",
    //   route: "people",
    //   selected: false,
    //   visible: true,
    // },
  ];
  private tabs$ = new BehaviorSubject<Tab[]>(this.tabs);

  constructor() {}
  public getTabs(): Observable<Tab[]> {
    return this.tabs$.asObservable();
  }
  public setIconsForHome() {
    this.tabs[0].visible = true;
    this.tabs[1].visible = true;
    this.tabs[2].visible = true;
    this.tabs[3].visible = true;
    this.tabs[4].visible = true;
    this.tabs[5].visible = false;
    this.tabs[6].visible = false;
    this.tabs$.next(this.tabs);
  }

  public setIconsForCatalog() {
    this.tabs[0].visible = true;
    this.tabs[1].visible = false;
    this.tabs[2].visible = false;
    this.tabs[3].visible = false;
    this.tabs[4].visible = false;
    this.tabs[5].visible = true;
    this.tabs[6].visible = true;
    this.tabs$.next(this.tabs);
  }
}
