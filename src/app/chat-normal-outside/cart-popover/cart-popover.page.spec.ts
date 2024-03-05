import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartPopoverPage } from './cart-popover.page';

describe('CartPopoverPage', () => {
  let component: CartPopoverPage;
  let fixture: ComponentFixture<CartPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
