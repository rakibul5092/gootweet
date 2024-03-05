import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerWalletPage } from './designer-wallet.page';

describe('DesignerWalletPage', () => {
  let component: DesignerWalletPage;
  let fixture: ComponentFixture<DesignerWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerWalletPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
