import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { users } from "../../../../constants";
import { ProfileService } from "../profile.service";
import { User } from "../../../../models/user";
import { getUser } from "../../../../services/functions/functions";
import { first } from "rxjs/operators";
import { ScreenService } from "src/app/services/screen.service";
import { ProductFilterService } from "src/app/components/home-page/sub-category/product-filter.service";
import { Observable } from "rxjs";
import { ModalController } from "@ionic/angular";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-catalog",
  templateUrl: "./catalog.page.html",
  styleUrls: ["./catalog.page.scss"],
})
export class CatalogPage implements OnInit {
  productOwner: any;
  ownerUid: string;
  me: User;
  isDesignerLoggedIn: boolean = false;
  isWeb = true;
  results: Observable<any>;
  noProductFound: Observable<boolean>;

  constructor(
    public profileService: ProfileService,
    private firestore: AngularFirestore,
    private router: Router,
    public screen: ScreenService,
    public productFilterService: ProductFilterService,
    private storage: LoginService
  ) {}

  ionViewDidEnter() {
    this.profileService.products = [];
  }

  ngOnInit() {
    this.profileService.products = [];
    this.productFilterService.searching = false;
    this.productFilterService.initSearch(
      "products_title",
      20,
      this.ownerUid,
      false
    );
    this.results = this.productFilterService.searchResult;
    this.ownerUid = this.router.url.split("/")[3];
    this.profileService.getInnerCategories(this.ownerUid);
    this.noProductFound = this.profileService.noProductsFound.asObservable();
    this.profileService.innerCategories.subscribe((innerCats) => {
      if (innerCats && innerCats.length > 0) {
        this.profileService.findProduct(
          this.ownerUid,
          this.screen.width.value <= 500
        );
      }
    });
    this.screen.width.subscribe((size) => {
      this.isWeb = size > 500;
    });
    this.storage.getUser().then((user: User) => {
      if (user) {
        this.me = user;
        this.isDesignerLoggedIn = this.me.rule == "designer";
      }
    });

    this.firestore
      .collection(users)
      .doc(this.ownerUid)
      .get()
      .pipe(first())
      .subscribe((query) => {
        this.productOwner = query.data();
      });
  }

  onSearch(event) {
    this.productFilterService.searching = true;
    this.productFilterService.initQuery(event);
    this.productFilterService.onFilter();
  }
  onCancel() {
    this.productFilterService.searching = false;
  }
}
