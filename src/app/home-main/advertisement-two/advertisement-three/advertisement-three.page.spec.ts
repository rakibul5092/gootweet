import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvertisementThreePage } from './advertisement-three.page';

describe('AdvertisementThreePage', () => {
  let component: AdvertisementThreePage;
  let fixture: ComponentFixture<AdvertisementThreePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementThreePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertisementThreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
