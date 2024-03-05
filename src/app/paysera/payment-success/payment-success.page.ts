import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, first } from "rxjs";
import { ScreenService } from "src/app/services/screen.service";
import { PaymentResponseService } from "../payment-response.service";

@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.page.html",
  styleUrls: ["./payment-success.page.scss"],
})
export class PaymentSuccessPage implements OnInit {
  public response$: Observable<any> = new Observable();
  constructor(
    private screen: ScreenService,
    private route: ActivatedRoute,
    private paymentResponseService: PaymentResponseService
  ) {}

  ionViewWillEnter() {
    this.screen.fullScreen.next(true);
  }

  ngOnInit() {
    this.route.queryParams.pipe(first()).subscribe((params) => {
      if (params && params.data) {
        this.response$ = this.paymentResponseService.onPaymentResponse(
          params.data,
          1
        );
      }
    });
  }
}
