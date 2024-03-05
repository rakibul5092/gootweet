import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerRequestPage } from './designer-request.page';

describe('DesignerRequestPage', () => {
  let component: DesignerRequestPage;
  let fixture: ComponentFixture<DesignerRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
