import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerMyManufacturerCatalogOnePage } from './designer-my-manufacturer-catalog-one.page';

describe('DesignerMyManufacturerCatalogOnePage', () => {
  let component: DesignerMyManufacturerCatalogOnePage;
  let fixture: ComponentFixture<DesignerMyManufacturerCatalogOnePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerMyManufacturerCatalogOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerMyManufacturerCatalogOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
