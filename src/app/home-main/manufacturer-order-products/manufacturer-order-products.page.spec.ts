import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManufacturerOrderProductsPage } from './manufacturer-order-products.page';

describe('ManufacturerOrderProductsPage', () => {
  let component: ManufacturerOrderProductsPage;
  let fixture: ComponentFixture<ManufacturerOrderProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerOrderProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerOrderProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
