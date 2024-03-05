import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-popover-video',
  templateUrl: './popover-video.component.html',
  styleUrls: ['./popover-video.component.scss'],
})
export class PopoverVideoComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() { }
  async onEnd() {
    localStorage.setItem('popovervideoplayed', '1')
    await this.modalController.dismiss()
  }

}
