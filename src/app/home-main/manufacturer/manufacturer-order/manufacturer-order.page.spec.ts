import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManufacturerOrderPage } from './manufacturer-order.page';

describe('ManufacturerOrderPage', () => {
  let component: ManufacturerOrderPage;
  let fixture: ComponentFixture<ManufacturerOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
