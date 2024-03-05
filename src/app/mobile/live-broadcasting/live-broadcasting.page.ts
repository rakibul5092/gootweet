import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-live-broadcasting',
  templateUrl: './live-broadcasting.page.html',
  styleUrls: ['./live-broadcasting.page.scss'],
})
export class LiveBroadcastingPage implements OnInit {

  constructor(private nav: NavController, private screen: ScreenService) { }
  ionViewWillEnter() {
    this.screen.fullScreen.next(true)
  }

  ionViewWillLeave() {
    this.screen.fullScreen.next(false)
  }

  ngOnInit() {
  }

}
