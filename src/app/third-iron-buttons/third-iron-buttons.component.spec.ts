import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdIronButtonsComponent } from './third-iron-buttons.component';

describe('ThirdIronButtonsComponent', () => {
  let component: ThirdIronButtonsComponent;
  let fixture: ComponentFixture<ThirdIronButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdIronButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdIronButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
