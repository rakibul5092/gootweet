import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CloudinaryPlayerComponent } from './cloudinary-player.component';

describe('CloudinaryPlayerComponent', () => {
  let component: CloudinaryPlayerComponent;
  let fixture: ComponentFixture<CloudinaryPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudinaryPlayerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CloudinaryPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
