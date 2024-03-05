import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvertisementTwoPage } from './advertisement-two.page';

describe('AdvertisementTwoPage', () => {
  let component: AdvertisementTwoPage;
  let fixture: ComponentFixture<AdvertisementTwoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementTwoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertisementTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
