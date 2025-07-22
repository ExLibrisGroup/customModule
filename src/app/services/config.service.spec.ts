import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

// Mock module parameters that can be reused across test files
export const MOCK_MODULE_PARAMETERS = {
  articlePDFDownloadLinkEnabled: true,
  primoArticlePDFDownloadLinkEnabled: true,
  articleLinkEnabled: true,
  showFormatChoice: true,
  articleRetractionWatchEnabled: true,
  articleExpressionOfConcernEnabled: true,
  journalBrowZineWebLinkTextEnabled: true,
  articleBrowZineWebLinkTextEnabled: true,
  documentDeliveryFulfillmentEnabled: true,
  showLinkResolverLink: true,
};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
      ],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
