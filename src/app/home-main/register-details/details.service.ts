import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../../constants";

const URL = "https://restcountries.eu/rest/v2/";

@Injectable({
  providedIn: "root",
})
export class DetailsService {
  constructor(private http: HttpClient) {}

  getAllCountries() {
    const ENDURL = "all?fields=name;flag";
    return this.http.get(URL + ENDURL);
  }
  getFilteredCountries(filter: string) {
    const ENDURL = "name/" + filter + "?fields=name;flag";
    return this.http.get(URL + ENDURL);
  }

  finalUpload(postData: any) {
    const ENDURL = "register_details_upload.php";
    return this.http.post(BASE_URL + ENDURL, postData);
  }
}
