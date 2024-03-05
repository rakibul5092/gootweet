import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerManufacturerAlphabeticallyPage } from './designer-manufacturer-alphabetically.page';

describe('DesignerManufacturerAlphabeticallyPage', () => {
  let component: DesignerManufacturerAlphabeticallyPage;
  let fixture: ComponentFixture<DesignerManufacturerAlphabeticallyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerManufacturerAlphabeticallyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerManufacturerAlphabeticallyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
