import { Component, EventEmitter, Input, OnInit, Output, Sanitizer } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Video } from 'src/app/models/video';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() video: Video
  @Input() autoplay = true;
  @Input() width = 300;
  @Input() height = 200
  @Input() isMobile: false;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter()
  constructor(public sanitizer: Sanitizer) { }

  ngOnInit() { }
  close() {
    this.onClose.emit(false)
  }


}
