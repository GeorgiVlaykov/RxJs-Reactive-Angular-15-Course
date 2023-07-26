import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CoursesCardListComponent } from "./courses-card-list.component";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesCardListComponent],
    });
    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
