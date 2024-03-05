import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubCategoryFilterPopupPage } from './sub-category-filter-popup.page';

describe('SubCategoryFilterPopupPage', () => {
  let component: SubCategoryFilterPopupPage;
  let fixture: ComponentFixture<SubCategoryFilterPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryFilterPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryFilterPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
