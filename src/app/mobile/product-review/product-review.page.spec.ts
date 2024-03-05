import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductReviewPage } from './product-review.page';

describe('ProductReviewPage', () => {
  let component: ProductReviewPage;
  let fixture: ComponentFixture<ProductReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
