import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-select-payment-method',
  templateUrl: './select-payment-method.page.html',
  styleUrls: ['./select-payment-method.page.scss'],
})
export class SelectPaymentMethodPage implements OnInit {

  constructor(private nav: NavController, private screen: ScreenService) { }

  ngOnInit() {
  }

  ionViewWillEnter=()=>this.screen.fullScreen.next(true);
  ionViewWillLeave=()=>this.screen.fullScreen.next(false);

  gotoPaymentConfirmation(){
    this.nav.navigateForward('further-information',{animated: true, animationDirection:'forward'});
  }

}
