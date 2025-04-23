import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowzineButtonComponent } from './browzine-button.component';

describe('BrowzineButtonComponent', () => {
  let component: BrowzineButtonComponent;
  let fixture: ComponentFixture<BrowzineButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowzineButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowzineButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
