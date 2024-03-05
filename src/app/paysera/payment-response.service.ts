import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PaymentResponseService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param type 1. payment success, 2. payment failed, 3. topup success, 4. topup failed
   */
  onPaymentResponse(data: string, type: number) {
    let url = "";
    switch (type) {
      case 1:
        url =
          "https://manufacturers.gootweet.com/api/v1/payments/payment_success?data=";
        break;
      case 2:
        url =
          "https://manufacturers.gootweet.com/api/v1/payments/payment_failed?data=";
        break;
      case 3:
        url =
          "https://manufacturers.gootweet.com/api/v1/payments/topup_success?data=";
        break;
      case 4:
        url =
          "https://manufacturers.gootweet.com/api/v1/payments/topup_failed?data=";
        break;
    }

    return this.http.get(url + data);
  }
}
