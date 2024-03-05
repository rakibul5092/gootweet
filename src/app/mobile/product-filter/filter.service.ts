import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FilterService {
    onInnerCategoryClicked = new BehaviorSubject<{ event: any, searchIndex: string }>(null)
    constructor() { }

}
