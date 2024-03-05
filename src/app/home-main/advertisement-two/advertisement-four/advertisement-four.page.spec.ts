import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvertisementFourPage } from './advertisement-four.page';

describe('AdvertisementFourPage', () => {
  let component: AdvertisementFourPage;
  let fixture: ComponentFixture<AdvertisementFourPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementFourPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertisementFourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
