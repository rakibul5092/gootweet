import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectiveLoadingStrategy implements PreloadingStrategy {
  routes = new Map();

  preload(route: Route, load: Function): Observable<any> {
    if (route.data && route.data.name) {
      this.routes[route.data.name] = {
        route,
        load,
      };
    }
    return of(null);
  }

  preLoadRoute(names: string[]) {
    names.forEach((name) => {
      const route = this.routes[name];
      if (route) {
        route.load();
      }
    });
  }
}
