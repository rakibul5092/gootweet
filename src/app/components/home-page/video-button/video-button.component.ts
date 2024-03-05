import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-video-button',
  templateUrl: './video-button.component.html',
  styleUrls: ['./video-button.component.scss'],
})
export class VideoButtonComponent implements OnInit {
  @Input() countVisible = false;
  @Input() count = 0;
  @Output() onVideoClickEvent: EventEmitter<any> = new EventEmitter()
  constructor(private nav: NavController) { }

  ngOnInit() { }
  onVideoBtnClick() {
    if (this.countVisible) {
      this.gotoLiveStreams()
    } else {
      this.onVideoClickEvent.emit({ visible: true })
    }
  }
  gotoLiveStreams() {
    this.nav.navigateForward("all-live-stream");
  }

}
