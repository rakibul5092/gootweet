import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class GotoProfileService {
  constructor(private router: Router) { }

  gotoProfile(profileOwner: any, isRandomProfile = false) {
    let first_name = profileOwner?.full_name?.first_name || profileOwner?.first_name || '';

    let last_name = profileOwner?.full_name?.last_name || profileOwner?.last_name || ''


    first_name = first_name.replace(/\s/g, "-")
      .replace(/\\|\//g, "-") + "_";

    last_name = last_name.replace(/\s/g, "-")
      .replace(/\\|\//g, "-");
    this.router.navigate([
      "profile/" + first_name + last_name,
      profileOwner.uid,
    ]);
  }
}
