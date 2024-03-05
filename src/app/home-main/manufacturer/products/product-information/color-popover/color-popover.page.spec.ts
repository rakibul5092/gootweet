import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorPopoverPage } from './color-popover.page';

describe('ColorPopoverPage', () => {
  let component: ColorPopoverPage;
  let fixture: ComponentFixture<ColorPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
