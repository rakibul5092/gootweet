import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeDesignerPage } from './home-designer.page';

describe('HomeDesignerPage', () => {
  let component: HomeDesignerPage;
  let fixture: ComponentFixture<HomeDesignerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDesignerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDesignerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
