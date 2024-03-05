import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerSendingRequestPage } from './designer-sending-request.page';

describe('DesignerSendingRequestPage', () => {
  let component: DesignerSendingRequestPage;
  let fixture: ComponentFixture<DesignerSendingRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerSendingRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerSendingRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
