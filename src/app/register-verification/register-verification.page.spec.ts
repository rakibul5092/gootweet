import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { RegisterVerificationPage } from "./register-verification.page";

describe("RegisterVerificationPage", () => {
  let component: RegisterVerificationPage;
  let fixture: ComponentFixture<RegisterVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterVerificationPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
