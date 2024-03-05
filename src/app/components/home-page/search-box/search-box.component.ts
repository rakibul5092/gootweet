import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController } from "@ionic/angular";
import { first } from "rxjs/operators";
import { GotoProfileService } from "src/app/services/goto-profile.service";
import { HeaderService } from "../../layouts/header/header.service";

@Component({
  selector: "app-search-box",
  templateUrl: "./search-box.component.html",
  styleUrls: ["./search-box.component.scss"],
})
export class SearchBoxComponent implements OnInit {
  @Input() inHeader = false;
  searchText: string;
  searchResult = [];
  showResult = false;
  suggestionOpen = false;

  constructor(
    private http: HttpClient,
    private nav: NavController,
    private gotoProfileService: GotoProfileService,
    private eRef: ElementRef,
    public headerService: HeaderService
  ) {}

  ngOnInit() {}
  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      this.showResult = true;
    } else {
      this.showResult = false;
    }
  }

  gotoProfile(hit) {
    this.suggestionOpen = false;
    this.gotoProfileService.gotoProfile(hit);
  }

  searchOnEnter(e) {
    const hit = e?.target?.value || "";
    this.showResult = false;
    let navExtra: NavigationExtras = {
      queryParams: {
        search_query: hit,
        isUserSearch: true,
        isProduct: false,
        isAll: false,
      },
    };
    this.showResult = false;
    this.suggestionOpen = false;
    if (hit?.length >= 3) {
      this.nav.navigateForward("search-result", navExtra);
    }
  }

  onSearchByKeyword(event) {
    if (event.target.value.length >= 3) {
      this.searchText = event.target.value;
      this.searchResult = [];
      this.getSearchSuggestions(this.searchText)
        .pipe(first())
        .subscribe((res: any) => {
          if (res.success) {
            this.searchResult = res.data;
            if (this.searchResult) {
              this.showResult = true;
              this.suggestionOpen = true;
            }
          }
        });
      if (event.type == "click") {
        this.suggestionOpen = true;
      }
    } else {
      this.showResult = false;
    }
  }

  getSearchSuggestions(text: string) {
    let formData = new FormData();
    formData.append("search_text", text);
    return this.http.post(
      "https://api.gootweet.com/cross-api/user_search.php",
      formData
    );
  }
}
