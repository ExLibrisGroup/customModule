import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdIronAdapterComponent } from './third-iron-adapter.component';

describe('ThirdIronAdapterComponent', () => {
  let component: ThirdIronAdapterComponent;
  let fixture: ComponentFixture<ThirdIronAdapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdIronAdapterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdIronAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
