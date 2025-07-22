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
import { MOCK_MODULE_PARAMETERS } from './config.service.spec';

describe('JournalCoverService', () => {
  let httpTesting: HttpTestingController;
  let service: JournalCoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JournalCoverService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(JournalCoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
