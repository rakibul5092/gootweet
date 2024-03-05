import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { connections, requests, users } from "../../constants";
import {
  ConnectionDesignerData,
  ManufacturerConnection,
  UserInfo,
} from "../../models/connection";
import { User } from "../../models/user";
import { ProductsService } from "../../home-main/manufacturer/products/products.service";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DesignerRequestService {
  request;
  senderData: User;
  manufacturerData;
  designerData;
  connectedDesigner: ManufacturerConnection[] = [];

  constructor(
    private firestore: AngularFirestore,
    private nav: NavController,
    private productService: ProductsService
  ) {}

  fetch_notification_data(requestUid, manufacturerUid) {
    const manufacturerRef = this.firestore
      .collection(users)
      .doc(manufacturerUid);

    manufacturerRef
      .collection(requests)
      .doc(requestUid)
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query.exists) {
          this.request = query.data();
          this.firestore
            .collection(users)
            .doc(this.request.designer_uid)
            .get()
            .pipe(first())
            .subscribe((query) => {
              this.senderData = query.data() as User;
            });
        }
      });
  }

  requestAccept(requestUid, manufacturerUid) {
    const manufacturerRef = this.firestore
      .collection(users)
      .doc(manufacturerUid);
    const designerRef = this.firestore
      .collection(users)
      .doc(this.request.designer_uid);

    manufacturerRef
      .get()
      .pipe(first())
      .subscribe((query) => {
        this.manufacturerData = query.data();
      });

    designerRef
      .get()
      .pipe(first())
      .subscribe((query) => {
        this.designerData = query.data();
      });

    let AcceptedDesignerData = {
      desginger_uid: this.request.designer_uid,
      commission: this.request.commission,
      request_uid: requestUid,
    };

    let AcceptingManufacturerData = {
      manufacturer_uid: manufacturerUid,
      commission: this.request.commission,
      request_uid: requestUid,
    };

    manufacturerRef
      .collection(connections)
      .doc(this.request.designer_uid)
      .set(AcceptedDesignerData)
      .then(() => {
        designerRef
          .collection(connections)
          .doc(manufacturerUid)
          .set(AcceptingManufacturerData)
          .then(() => {
            this.nav.back();
            this.productService.showToast("Connected now!", "success");
          });
      });
  }

  getConnectedDesigners(manufacturerUid: string) {
    this.firestore
      .collection(users)
      .doc(manufacturerUid)
      .collection(connections)
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (query) {
          this.connectedDesigner = [];
          query.forEach((item) => {
            let designer = item.data() as ConnectionDesignerData;
            let designerUid = item.id;
            this.firestore
              .collection(users)
              .doc(designerUid)
              .get()
              .pipe(first())
              .subscribe((designerQuery) => {
                let userData = designerQuery.data() as User;
                let info: UserInfo = {
                  full_name: {
                    first_name: userData?.full_name?.first_name,
                    last_name: userData?.full_name?.last_name,
                  },
                  rule: userData?.rule,
                  uid: userData?.uid,
                  profile_image: userData?.profile_photo,
                };
                this.connectedDesigner.push({
                  id: designerUid,
                  connectionData: designer,
                  designerInfo: info,
                });
              });
          });
        }
      });
  }

  getRequestData(m_uid: string, request_uid: string) {
    return this.firestore
      .collection(users)
      .doc(m_uid)
      .collection(connections)
      .doc(request_uid)
      .get();
  }
}
