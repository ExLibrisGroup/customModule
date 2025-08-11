import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedDropdownComponent } from './stacked-dropdown.component';
import { ComponentRef } from '@angular/core';

describe('StackedDropdownComponent', () => {
  let component: StackedDropdownComponent;
  let componentRef: ComponentRef<StackedDropdownComponent>;
  let fixture: ComponentFixture<StackedDropdownComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StackedDropdownComponent],
    });
    fixture = TestBed.createComponent(StackedDropdownComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
