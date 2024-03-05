import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialsPopupPage } from './materials-popup.page';

describe('MaterialsPopupPage', () => {
  let component: MaterialsPopupPage;
  let fixture: ComponentFixture<MaterialsPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
