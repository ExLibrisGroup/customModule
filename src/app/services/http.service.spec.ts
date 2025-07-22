import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { HttpService } from './http.service';
import { MOCK_MODULE_PARAMETERS } from './config.service.spec';

describe('HttpService', () => {
  let httpTesting: HttpTestingController;
  let service: HttpService;

  const responseMeta = {
    ok: true,
    status: 200,
    url: 'https://public-api.thirdiron.com/public/v1/libraries/322/search',
    body: {
      data: [],
      included: [
        {
          id: 18126,
          type: 'journals',
          title: 'theBMJ',
          issn: '09598138',
          sjrValue: 2.567,
          coverImageUrl:
            'https://assets.thirdiron.com/images/covers/0959-8138.png',
          browzineEnabled: true,
          browzineWebLink:
            'https://develop.browzine.com/libraries/XXX/journals/18126',
        },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
