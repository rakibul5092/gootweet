import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { requests, users } from "../../constants";
import {
  RequestFromDesigner,
  RequestToManufacturer,
} from "../../models/request";

@Injectable({
  providedIn: "root",
})
export class SendRequestService {
  constructor(private firestore: AngularFirestore) {}
  async storeRequestDataToDesigner(
    designer_uid: string,
    manufacturer_uid: string,
    designerData: RequestFromDesigner
  ) {
    return await this.firestore
      .collection(users)
      .doc(designer_uid)
      .collection(requests)
      .doc(manufacturer_uid)
      .set(designerData);
  }

  async storeRequestDataToManufacturer(
    manufacturer_uid: string,
    designer_uid: string,
    manufacturerData: RequestToManufacturer
  ) {
    return await this.firestore
      .collection(users)
      .doc(manufacturer_uid)
      .collection(requests)
      .doc(designer_uid)
      .set(manufacturerData);
  }
}
