import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { User } from "../../../models/user";
import { CategoriesService } from "./categories.service";
import { getUser } from "../../../services/functions/functions";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  @Output() profileCheckEvent: EventEmitter<any> = new EventEmitter();
  isLoggedIn = false;
  userType: string;
  me: User;

  constructor(public service: CategoriesService) {}

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        this.userType = user.rule;
        this.isLoggedIn = true;
        this.me = user;
        this.profileCheckEvent.emit(true);
        this.service.init();
      } else {
        this.isLoggedIn = true;
      }
    });
  }
}
