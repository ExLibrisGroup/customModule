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
import { ApiService } from './api.service';

describe('JournalCoverService', () => {
  let httpTesting: HttpTestingController;
  let service: JournalCoverService;
  // let apiService: ApiService;
  // let httpClient: HttpClient;
  // let httpErrorResponse: HttpErrorResponse;

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
    // apiService = TestBed.inject(ApiService);
    // httpClient = TestBed.inject(HttpClient);
    // httpErrorResponse = TestBed.inject(HttpErrorResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
