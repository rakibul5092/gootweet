import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackingManufacturersPage } from './tracking-manufacturers.page';

describe('TrackingManufacturersPage', () => {
  let component: TrackingManufacturersPage;
  let fixture: ComponentFixture<TrackingManufacturersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingManufacturersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingManufacturersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
