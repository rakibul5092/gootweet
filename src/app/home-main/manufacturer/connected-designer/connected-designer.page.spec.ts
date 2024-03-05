import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ConnectedDesignerPage} from './connected-designer.page';

describe('ConnectedDesignerPage', () => {
  let component: ConnectedDesignerPage;
  let fixture: ComponentFixture<ConnectedDesignerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectedDesignerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedDesignerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
