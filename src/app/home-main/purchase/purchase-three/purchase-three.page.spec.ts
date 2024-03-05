import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurchaseThreePage } from './purchase-three.page';

describe('PurchaseThreePage', () => {
  let component: PurchaseThreePage;
  let fixture: ComponentFixture<PurchaseThreePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseThreePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseThreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
