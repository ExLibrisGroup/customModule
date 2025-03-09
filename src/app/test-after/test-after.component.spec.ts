import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAfterComponent } from './test-after.component';

describe('TestAfterComponent', () => {
  let component: TestAfterComponent;
  let fixture: ComponentFixture<TestAfterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAfterComponent]
    });
    fixture = TestBed.createComponent(TestAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
