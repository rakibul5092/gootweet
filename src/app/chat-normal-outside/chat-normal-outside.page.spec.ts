import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatNormalOutsidePage } from './chat-normal-outside.page';

describe('ChatNormalOutsidePage', () => {
  let component: ChatNormalOutsidePage;
  let fixture: ComponentFixture<ChatNormalOutsidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatNormalOutsidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatNormalOutsidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
