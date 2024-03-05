import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-russian-basket',
  templateUrl: './russian-basket.page.html',
  styleUrls: ['./russian-basket.page.scss'],
})
export class RussianBasketPage implements OnInit {

  constructor(private screen: ScreenService) { }
  ionViewWillEnter = () => this.screen.fullScreen.next(true);
  ionViewWillLeave = () => this.screen.fullScreen.next(false);

  ngOnInit() {
  }

}
