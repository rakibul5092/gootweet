import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-more-videos',
  templateUrl: './more-videos.page.html',
  styleUrls: ['./more-videos.page.scss'],
})
export class MoreVideosPage implements OnInit {

  constructor(private screen: ScreenService) { }
  ionViewWillEnter() {
    this.screen.fullScreen.next(true)
  }

  ionViewWillLeave() {
    this.screen.fullScreen.next(false)
  }
  ngOnInit() {
  }

}
