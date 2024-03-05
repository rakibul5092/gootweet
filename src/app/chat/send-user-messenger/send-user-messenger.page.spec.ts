import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendUserMessengerPage } from './send-user-messenger.page';

describe('SendUserMessengerPage', () => {
  let component: SendUserMessengerPage;
  let fixture: ComponentFixture<SendUserMessengerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendUserMessengerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendUserMessengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
