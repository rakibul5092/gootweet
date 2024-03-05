import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendDesignerMessengerPage } from './send-designer-messenger.page';

describe('SendDesignerMessengerPage', () => {
  let component: SendDesignerMessengerPage;
  let fixture: ComponentFixture<SendDesignerMessengerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendDesignerMessengerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendDesignerMessengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
