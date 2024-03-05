import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurseReplenishmentPage } from './purse-replenishment.page';

describe('PurseReplenishmentPage', () => {
  let component: PurseReplenishmentPage;
  let fixture: ComponentFixture<PurseReplenishmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurseReplenishmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PurseReplenishmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
