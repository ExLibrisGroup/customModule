import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeWaharoaComponent } from './te-waharoa.component';

describe('TeWaharoaComponent', () => {
  let component: TeWaharoaComponent;
  let fixture: ComponentFixture<TeWaharoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeWaharoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeWaharoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
