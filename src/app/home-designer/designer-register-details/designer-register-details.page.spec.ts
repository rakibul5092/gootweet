import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerRegisterDetailsPage } from './designer-register-details.page';

describe('DesignerRegisterDetailsPage', () => {
  let component: DesignerRegisterDetailsPage;
  let fixture: ComponentFixture<DesignerRegisterDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerRegisterDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerRegisterDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
