import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTopComponent } from './test-top.component';

describe('TestTopComponent', () => {
  let component: TestTopComponent;
  let fixture: ComponentFixture<TestTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTopComponent]
    });
    fixture = TestBed.createComponent(TestTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
