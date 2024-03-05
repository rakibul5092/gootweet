import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterVerifiedPage } from './register-verified.page';

describe('RegisterVerifiedPage', () => {
  let component: RegisterVerifiedPage;
  let fixture: ComponentFixture<RegisterVerifiedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterVerifiedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterVerifiedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
