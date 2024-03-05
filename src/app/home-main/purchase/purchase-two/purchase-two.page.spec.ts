import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurchaseTwoPage } from './purchase-two.page';

describe('PurchaseTwoPage', () => {
  let component: PurchaseTwoPage;
  let fixture: ComponentFixture<PurchaseTwoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTwoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
