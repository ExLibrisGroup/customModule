import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBeforeComponent } from './test-before.component';

describe('TestBeforeComponent', () => {
  let component: TestBeforeComponent;
  let fixture: ComponentFixture<TestBeforeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestBeforeComponent]
    });
    fixture = TestBed.createComponent(TestBeforeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
