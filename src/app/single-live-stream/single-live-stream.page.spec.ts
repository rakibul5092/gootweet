import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleLiveStreamPage } from './single-live-stream.page';

describe('SingleLiveStreamPage', () => {
  let component: SingleLiveStreamPage;
  let fixture: ComponentFixture<SingleLiveStreamPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleLiveStreamPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleLiveStreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


