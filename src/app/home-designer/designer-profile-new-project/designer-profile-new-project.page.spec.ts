import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerProfileNewProjectPage } from './designer-profile-new-project.page';

describe('DesignerProfileNewProjectPage', () => {
  let component: DesignerProfileNewProjectPage;
  let fixture: ComponentFixture<DesignerProfileNewProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerProfileNewProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerProfileNewProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
