import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { MaterialsAddPage } from "./materials-add.page";

describe("MaterialsAddPage", () => {
  let component: MaterialsAddPage;
  let fixture: ComponentFixture<MaterialsAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialsAddPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
