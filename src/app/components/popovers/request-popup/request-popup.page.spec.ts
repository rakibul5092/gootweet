import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestPopupPage } from './request-popup.page';

describe('RequestPopupPage', () => {
  let component: RequestPopupPage;
  let fixture: ComponentFixture<RequestPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
