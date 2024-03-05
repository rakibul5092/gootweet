import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerGeneralSettingsPage } from './designer-general-settings.page';

describe('DesignerGeneralSettingsPage', () => {
  let component: DesignerGeneralSettingsPage;
  let fixture: ComponentFixture<DesignerGeneralSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerGeneralSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerGeneralSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
