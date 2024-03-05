import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-browse-photo',
  templateUrl: './browse-photo.component.html',
  styleUrls: ['./browse-photo.component.scss'],
})
export class BrowsePhotoComponent implements OnInit {
  @Input() right:string
  @Input() bottom:string
  @Input() top:string
  @Output() onBrowse:EventEmitter<any> = new EventEmitter()
  constructor() { }

  ngOnInit() {}

  onBrowseProfileImage(event){
    this.onBrowse.emit(event)
  }

}
