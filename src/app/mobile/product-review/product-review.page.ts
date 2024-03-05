import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.page.html',
  styleUrls: ['./product-review.page.scss'],
})
export class ProductReviewPage implements OnInit {

  constructor(private nav: NavController, private screen: ScreenService) { }

  ngOnInit() {
  }

  ionViewWillEnter=()=>this.screen.fullScreen.next(true);
  ionViewWillLeave=()=>this.screen.fullScreen.next(false);

  gotoPaymentMethod(){
    this.nav.navigateForward('select-payment-method',{animated: true, animationDirection:'forward'});
  }
}
