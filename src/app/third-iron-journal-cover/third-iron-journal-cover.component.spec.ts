import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdIronJournalCoverComponent } from './third-iron-journal-cover.component';

describe('ThirdIronJournalCoverComponent', () => {
  let component: ThirdIronJournalCoverComponent;
  let fixture: ComponentFixture<ThirdIronJournalCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdIronJournalCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdIronJournalCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
