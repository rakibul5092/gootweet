import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeMainPage } from './home-main.page';

describe('HomeMainPage', () => {
  let component: HomeMainPage;
  let fixture: ComponentFixture<HomeMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
