import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ThirdIronJournalCoverComponent } from './third-iron-journal-cover.component';
import { JournalCoverService } from '../../services/journal-cover.service';

describe('ThirdIronJournalCoverComponent', () => {
  let httpTesting: HttpTestingController;
  let journalCoverService: JournalCoverService;
  let component: ThirdIronJournalCoverComponent;
  let fixture: ComponentFixture<ThirdIronJournalCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdIronJournalCoverComponent],
      providers: [
        JournalCoverService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    journalCoverService = TestBed.inject(JournalCoverService);

    fixture = TestBed.createComponent(ThirdIronJournalCoverComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
