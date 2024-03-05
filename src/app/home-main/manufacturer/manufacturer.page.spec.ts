import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManufacturerPage } from './manufacturer.page';

describe('ManufacturerPage', () => {
  let component: ManufacturerPage;
  let fixture: ComponentFixture<ManufacturerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
