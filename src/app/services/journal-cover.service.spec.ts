import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { JournalCoverService } from './journal-cover.service';
import { HttpService } from './http.service';

describe('JournalCoverService', () => {
  let httpTesting: HttpTestingController;
  let service: JournalCoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JournalCoverService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(JournalCoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
