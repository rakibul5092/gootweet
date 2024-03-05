import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { php_api_base } from "src/app/constants";

@Injectable({
  providedIn: "root",
})
export class ProfileSliderService {
  constructor(private readonly http: HttpClient) { }

  getRandomProfiles() {
    return this.http.get<{ status: boolean, success: boolean, data: any[] }>(
      php_api_base + "random_users.php"
    ).pipe(map((actions) => actions.data.map(a => {
      return { ...a, full_name: { first_name: a.first_name, last_name: a.last_name } }
    })
    ));
  }
}
