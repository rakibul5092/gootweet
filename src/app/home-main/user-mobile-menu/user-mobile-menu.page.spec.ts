import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserMobileMenuPage } from './user-mobile-menu.page';

describe('UserMobileMenuPage', () => {
  let component: UserMobileMenuPage;
  let fixture: ComponentFixture<UserMobileMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMobileMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMobileMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
