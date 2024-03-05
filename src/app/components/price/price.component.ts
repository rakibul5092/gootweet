import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
  @Input() good: any;
  @Input() price: any;
  @Input() searched = false;
  constructor() {}

  ngOnInit() {}
}
