import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs-and-search',
  templateUrl: './tabs-and-search.component.html',
  styleUrls: ['./tabs-and-search.component.scss'],
})
export class TabsAndSearchComponent {
  @Input() isUser = true;
  @Input() activeType = 'wall';
  @Output() onManufacturerTabClick: EventEmitter<any> = new EventEmitter();
  @Output() onDesignerNavigation: EventEmitter<any> = new EventEmitter();
  selected = 'wall';
 
  changeType(type: string) {
    this.onManufacturerTabClick.emit(type)
  }

  changeDesignerNavigation(type: string) {
    this.onDesignerNavigation.emit(type)
  }

}
