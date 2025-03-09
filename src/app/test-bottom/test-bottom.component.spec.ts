import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBottomComponent } from './test-bottom.component';

describe('TestBottomComponent', () => {
  let component: TestBottomComponent;
  let fixture: ComponentFixture<TestBottomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestBottomComponent]
    });
    fixture = TestBed.createComponent(TestBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
