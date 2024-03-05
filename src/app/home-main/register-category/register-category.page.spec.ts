import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterCategoryPage } from './register-category.page';

describe('RegisterCategoryPage', () => {
  let component: RegisterCategoryPage;
  let fixture: ComponentFixture<RegisterCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
