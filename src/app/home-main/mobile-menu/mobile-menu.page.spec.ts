import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileMenuPage } from './mobile-menu.page';

describe('MobileMenuPage', () => {
  let component: MobileMenuPage;
  let fixture: ComponentFixture<MobileMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
