import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PursePage } from './purse.page';

describe('PursePage', () => {
  let component: PursePage;
  let fixture: ComponentFixture<PursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PursePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
