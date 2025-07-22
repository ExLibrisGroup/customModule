import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

// Mock module parameters that can be reused across test files
export const MOCK_MODULE_PARAMETERS = {
  apiUrl: 'https://public-api.thirdiron.com/public/v1/libraries/222',
  apiKey: 'a9c7fb8f-9758-4ff9-9dc9-fcb4cbf32724',
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
  unpaywallEmailAddressKey: 'info@thirdiron.com',
  // Unpaywall-specific parameters
  articlePDFDownloadViaUnpaywallEnabled: true,
  articleLinkViaUnpaywallEnabled: true,
  articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
  articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
  //TODO: add all the other module parameters
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
