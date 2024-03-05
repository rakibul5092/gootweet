import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveBroadcastingPage } from './live-broadcasting.page';

describe('LiveBroadcastingPage', () => {
  let component: LiveBroadcastingPage;
  let fixture: ComponentFixture<LiveBroadcastingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBroadcastingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveBroadcastingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
