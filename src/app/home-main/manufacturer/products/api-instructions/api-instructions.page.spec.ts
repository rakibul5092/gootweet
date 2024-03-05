import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApiInstructionsPage } from './api-instructions.page';

describe('ApiInstructionsPage', () => {
  let component: ApiInstructionsPage;
  let fixture: ComponentFixture<ApiInstructionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiInstructionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiInstructionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
