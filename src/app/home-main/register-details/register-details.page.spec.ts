import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { RegisterDetailsPage } from "./register-details.page";

describe("RegisterFourPage", () => {
  let component: RegisterDetailsPage;
  let fixture: ComponentFixture<RegisterDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterDetailsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
