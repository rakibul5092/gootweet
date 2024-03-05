import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  selected = 1;

  constructor(private nav: NavController, private screen: ScreenService) { }

  ngOnInit() {
  }

  ionViewWillEnter = () => this.screen.fullScreen.next(true);
  ionViewWillLeave = () => this.screen.fullScreen.next(false);

  gotoPaymentMethod() {
    this.nav.navigateForward('select-payment-method', { animated: true, animationDirection: 'forward' });
  }
}
