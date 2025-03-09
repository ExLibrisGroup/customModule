import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDisplayDetailsComponentDist } from './full-display-details.component';

describe('FullDisplayDetailsComponent', () => {
  let component: FullDisplayDetailsComponentDist;
  let fixture: ComponentFixture<FullDisplayDetailsComponentDist>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullDisplayDetailsComponentDist]
    });
    fixture = TestBed.createComponent(FullDisplayDetailsComponentDist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
