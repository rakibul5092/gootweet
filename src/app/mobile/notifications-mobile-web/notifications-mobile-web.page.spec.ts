import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificationsMobileWebPage } from './notifications-mobile-web.page';

describe('NotificationsMobileWebPage', () => {
  let component: NotificationsMobileWebPage;
  let fixture: ComponentFixture<NotificationsMobileWebPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsMobileWebPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsMobileWebPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
