import { TestBed } from '@angular/core/testing';

import { UnpaywallService } from './unpaywall.service';
import { MOCK_MODULE_PARAMETERS } from './config.service.spec';
import { ButtonType } from '../shared/button-type.enum';
import { EntityType } from '../shared/entity-type.enum';
import { UnpaywallData } from '../types/unpaywall.types';

describe('UnpaywallService', () => {
  let service: UnpaywallService;

  // Mock unpaywall response data
  const mockBasicUnpaywallData: UnpaywallData = {
    best_oa_location: {
      url_for_pdf: 'https://example.com/article.pdf',
      url_for_landing_page: 'https://example.com/article',
      host_type: 'repository',
      version: 'publishedVersion',
    },
  };

  const mockManuscriptData: UnpaywallData = {
    best_oa_location: {
      url_for_pdf: 'https://example.com/manuscript.pdf',
      url_for_landing_page: 'https://example.com/manuscript',
      host_type: 'repository',
      version: 'acceptedVersion',
    },
  };

  const mockPublisherData: UnpaywallData = {
    best_oa_location: {
      url_for_pdf: 'https://publisher.com/article.pdf',
      url_for_landing_page: 'https://publisher.com/article',
      host_type: 'publisher',
      version: 'publishedVersion',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnpaywallService,
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
      ],
    });
    service = TestBed.inject(UnpaywallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('unpaywallWaterfall', () => {
    describe('when moduleParameters.articlePDFDownloadViaUnpaywallEnabled is true', () => {
      it('should return UnpaywallDirectToPDF button type when PDF URL is available', () => {
        const response = { status: 200, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallDirectToPDF);
        expect(result.entityType).toBe(EntityType.Article);
        expect(result.mainUrl).toBe('https://example.com/article.pdf');
      });
    });

    describe('when moduleParameters.articlePDFDownloadViaUnpaywallEnabled is false', () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            UnpaywallService,
            {
              provide: 'MODULE_PARAMETERS',
              useValue: {
                ...MOCK_MODULE_PARAMETERS,
                articlePDFDownloadViaUnpaywallEnabled: false,
              },
            },
          ],
        });
        service = TestBed.inject(UnpaywallService);
      });

      // TODO: Karl - if the PDF link config setting is false, do we expect to return the article link? or nothing?
      it('should return default response since article pdf url is present but not enabled', () => {
        const response = { status: 200, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });
    });

    describe('when moduleParameters.articleLinkViaUnpaywallEnabled is false', () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            UnpaywallService,
            {
              provide: 'MODULE_PARAMETERS',
              useValue: {
                ...MOCK_MODULE_PARAMETERS,
                articleLinkViaUnpaywallEnabled: false,
              },
            },
          ],
        });
        service = TestBed.inject(UnpaywallService);
      });

      it('should skip article link and check manuscript PDF when available', () => {
        const response = { status: 200, body: mockManuscriptData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallManuscriptPDF);
        expect(result.entityType).toBe(EntityType.Article);
        expect(result.mainUrl).toBe('https://example.com/manuscript.pdf');
      });
    });

    describe('when moduleParameters.articleAcceptedManuscriptPDFViaUnpaywallEnabled is false', () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            UnpaywallService,
            {
              provide: 'MODULE_PARAMETERS',
              useValue: {
                ...MOCK_MODULE_PARAMETERS,
                articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
              },
            },
          ],
        });
        service = TestBed.inject(UnpaywallService);
      });

      it('should return default response since manuscript PDF is present but not enabled', () => {
        const response = { status: 200, body: mockManuscriptData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });
    });

    describe('when moduleParameters.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false', () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            UnpaywallService,
            {
              provide: 'MODULE_PARAMETERS',
              useValue: {
                ...MOCK_MODULE_PARAMETERS,
                articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
                articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: false,
              },
            },
          ],
        });
        service = TestBed.inject(UnpaywallService);
      });

      it('should return default response when all manuscript options are disabled', () => {
        const response = { status: 200, body: mockManuscriptData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });
    });

    describe('when avoidUnpaywallPublisherLinks is true', () => {
      it('should return default response for publisher host type', () => {
        const response = { status: 200, body: mockPublisherData };
        const result = service.unpaywallWaterfall(response, true);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });

      it('should still process repository host type', () => {
        const response = { status: 200, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, true);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallDirectToPDF);
        expect(result.entityType).toBe(EntityType.Article);
        expect(result.mainUrl).toBe('https://example.com/article.pdf');
      });
    });

    describe('when all module parameters are false', () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            UnpaywallService,
            {
              provide: 'MODULE_PARAMETERS',
              useValue: {
                ...MOCK_MODULE_PARAMETERS,
                articlePDFDownloadViaUnpaywallEnabled: false,
                articleLinkViaUnpaywallEnabled: false,
                articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
                articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: false,
              },
            },
          ],
        });
        service = TestBed.inject(UnpaywallService);
      });

      it('should return default response when all unpaywall features are disabled', () => {
        const response = { status: 200, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });
    });

    describe('when response status is not 200', () => {
      it('should return default response', () => {
        const response = { status: 404, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.None);
        expect(result.entityType).toBe(EntityType.Unknown);
        expect(result.mainUrl).toBe('');
      });
    });

    describe('waterfall priority order', () => {
      it('should prioritize Article PDF (url_for_pdf) over Article Link (url_for_landing_page) when both are available', () => {
        const response = { status: 200, body: mockBasicUnpaywallData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallDirectToPDF);
        expect(result.mainUrl).toBe('https://example.com/article.pdf');
      });

      it('should prioritize Article Link type over manuscript pdf', () => {
        const articleLinkOnlyData: UnpaywallData = {
          best_oa_location: {
            url_for_pdf: '', // No PDF available
            url_for_landing_page: 'https://example.com/article',
            host_type: 'repository',
            version: 'publishedVersion',
          },
        };

        const response = { status: 200, body: articleLinkOnlyData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallArticleLink);
        expect(result.mainUrl).toBe('https://example.com/article');
      });

      it('should prioritize manuscript pdf over manuscript article link', () => {
        const response = { status: 200, body: mockManuscriptData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallManuscriptPDF);
        expect(result.mainUrl).toBe('https://example.com/manuscript.pdf');
      });

      it('should use manuscript article link if no direct to pdf, article link or manuscript pdf urls found', () => {
        const manuscriptLinkOnlyData: UnpaywallData = {
          best_oa_location: {
            url_for_pdf: '', // No PDF available
            url_for_landing_page: 'https://example.com/manuscript',
            host_type: 'repository',
            version: 'acceptedVersion',
          },
        };

        const response = { status: 200, body: manuscriptLinkOnlyData };
        const result = service.unpaywallWaterfall(response, false);

        expect(result.mainButtonType).toBe(ButtonType.UnpaywallManuscriptLink);
        expect(result.mainUrl).toBe('https://example.com/manuscript');
      });
    });
  });
});
