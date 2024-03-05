import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductInformationPage } from './product-information.page';

describe('ProductInformationPage', () => {
  let component: ProductInformationPage;
  let fixture: ComponentFixture<ProductInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
