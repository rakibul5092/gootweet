import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-further-information',
  templateUrl: './further-information.page.html',
  styleUrls: ['./further-information.page.scss'],
})
export class FurtherInformationPage implements OnInit {

  constructor(private nav: NavController, private screen: ScreenService) { }

  ngOnInit() {
  }

  ionViewWillEnter=()=>this.screen.fullScreen.next(true);
  ionViewWillLeave=()=>this.screen.fullScreen.next(false);

}
