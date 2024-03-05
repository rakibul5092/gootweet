import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { cloud_function_base_url, commissions } from "../constants";
import { User } from "../models/user";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RequestServiceService {
  constructor(private http: HttpClient, private afs: AngularFirestore) {}
  getPreviousDesigner(manufacturerUid: string, myUid: string) {
    return this.http.get<{ status: boolean; data: User[] }>(
      cloud_function_base_url +
        "/get_previous_designer?my_uid=" +
        myUid +
        "&manufacturer_uid=" +
        manufacturerUid
    );
  }
  async getAverageCommission(manufacturerUid: string): Promise<number> {
    return await lastValueFrom(
      this.afs.collection(commissions).doc(manufacturerUid).get()
    ).then((query: any) => {
      return query?.data()?.averageCommission
        ? query.data().averageCommission
        : 5;
    });
  }
}
