import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ButtonInfoService } from './button-info.service';
import { HttpService } from './http.service';
import { TranslationService } from './translation.service';
import { EntityType } from '../shared/entity-type.enum';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';
import { DisplayWaterfallResponse } from '../types/displayWaterfallResponse.types';
import { SearchEntity } from '../types/searchEntity.types';
import { firstValueFrom } from 'rxjs';
import { ButtonType } from '../shared/button-type.enum';
import { MOCK_MODULE_PARAMETERS } from './config.service.spec';

// Mock for TranslationService
const mockTranslationService = {
  getTranslatedText: (key: string, fallback: string) => {
    const translations: { [key: string]: string } = {
      'fulldisplay.HTML': 'Read Online',
      'fulldisplay.PDF': 'Get PDF',
      'nde.delivery.code.otherOnlineOptions': 'Other online options',
    };
    return translations[key] || fallback;
  },
};

const authToken = 'a9c7fb8f-9758-4ff9-9dc9-fcb4cbf32724';
const baseUrl = 'https://public-api.thirdiron.com/public/v1/libraries/222';
const articlePath = `${baseUrl}/articles/doi/10.1002%2Fijc.25451?include=journal,library&access_token=${authToken}`;
const journalPath = `${baseUrl}/search?issns=00284793&access_token=${authToken}`;

const articleSearchEntity: SearchEntity = {
  pnx: {
    addata: {
      doi: ['10.1002/ijc.25451'],
    },
    display: {
      title: ['a test article title'],
      type: ['article'],
      oa: ['"free_for_read"'],
    },
  },
};

const journalSearchEntity: SearchEntity = {
  pnx: {
    addata: {
      issn: ['00284793'],
    },
    display: {
      title: ['a test journal title'],
      type: ['journal'],
    },
  },
};

const journalData: JournalData[] = [
  {
    id: 10292,
    type: 'journals',
    title: 'New England Journal of Medicine (NEJM)',
    issn: '00284793',
    coverImageUrl: 'https://assets.thirdiron.com/images/covers/0028-4793.png',
    browzineEnabled: true,
    browzineWebLink: 'https://browzine.com/libraries/XXX/journals/10292',
    sjrValue: 1.1,
  },
  {
    id: 10289,
    type: 'journals',
    title: 'The Boston Medical and Surgical Journal',
    issn: '00966762',
    coverImageUrl: 'https://assets.thirdiron.com/default-journal-cover.png',
    browzineEnabled: false,
    externalLink:
      'http://za2uf4ps7f.search.serialssolutions.com/?V=1.0&N=100&L=za2uf4ps7f&S=I_M&C=0096-6762',
    sjrValue: 1.1,
  },
];

const articleData: ArticleData = {
  id: 55134408,
  type: 'articles',
  title: 'New England Journal of Medicine reconsiders relationship with industry',
  date: '2015-05-12',
  doi: '10.1002/ijc.25451',
  authors: 'McCarthy, M.',
  inPress: false,
  availableThroughBrowzine: true,
  openAccess: false,
  bestIntegratorLink: '',
  unpaywallUsable: true,
  browzineWebLink:
    'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
  fullTextFile: 'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
  contentLocation: 'https://develop.browzine.com/libraries/XXX/articles/55134408',
  retractionNoticeUrl: 'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
  expressionOfConcernNoticeUrl: 'https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451',
  problematicJournalArticleNoticeUrl:
    'https://develop.libkey.io/libraries/1414/10.5897/JMA2014.0308',
  documentDeliveryFulfillmentUrl: 'test.document.delivery-url.com',
};

const responseMetaData = {
  body: {
    data: [],
  },
  ok: true,
  status: 200,
  url: 'third-iron.com',
};

const validateButton = (
  buttonInfo: DisplayWaterfallResponse,
  expectedValues: DisplayWaterfallResponse
) => {
  expect(buttonInfo.entityType).toBe(expectedValues.entityType);
  expect(buttonInfo.mainUrl).toBe(expectedValues.mainUrl);
  expect(buttonInfo.mainButtonType).toBe(expectedValues.mainButtonType);
  expect(buttonInfo.showBrowzineButton).toBe(expectedValues.showBrowzineButton);
  expect(buttonInfo.browzineUrl).toBe(expectedValues.browzineUrl);
};

const createTestModule = async (config: any) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      HttpService,
      ButtonInfoService,
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: 'MODULE_PARAMETERS',
        useValue: config,
      },
      {
        provide: TranslationService,
        useValue: mockTranslationService,
      },
    ],
  });
  await TestBed.compileComponents();
  return TestBed;
};

describe('ButtonInfoService', () => {
  let httpTesting: HttpTestingController;
  let service: ButtonInfoService;
  let httpService: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpService,
        ButtonInfoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService);
    service = TestBed.inject(ButtonInfoService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getDisplayInfo', () => {
    it('should make a call to the article endpoint for given doi based on entity obj', async () => {
      // request article info from api service
      const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);

      // `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
      // and creates a `Promise` of the response.
      const articlePromise = firstValueFrom(buttonInfo$);

      // At this point, the request is pending, and we can assert it was made
      // via the `HttpTestingController`:
      const req = httpTesting.expectOne(`${articlePath}`, 'Request to load the article');

      const mockedArticleData = {
        data: {
          ...articleData,
        },
      };

      // Flushing the request causes it to complete, delivering the result
      req.flush(mockedArticleData);

      expect(await articlePromise).toEqual({
        entityType: EntityType.Article,
        mainButtonType: ButtonType.Retraction,
        mainUrl: 'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        showBrowzineButton: false,
        secondaryUrl: '',
        showSecondaryButton: false, // this is an alert type button, don't show secondary btn
      });

      // Finally, we can assert that no other requests were made.
      httpTesting.verify();
    });
    it('should make a call to the journal endpoint for given issn based on entity obj', async () => {
      // request journal info from api service
      const buttonInfo$ = service.getDisplayInfo(journalSearchEntity);

      // `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
      // and creates a `Promise` of the response.
      const journalPromise = firstValueFrom(buttonInfo$);

      // At this point, the request is pending, and we can assert it was made
      // via the `HttpTestingController`:
      const req = httpTesting.expectOne(`${journalPath}`, 'Request to load the article');

      const mockedJournalData = {
        data: {
          ...journalData[0],
        },
      };

      // Flushing the request causes it to complete, delivering the result
      req.flush(mockedJournalData);

      expect(await journalPromise).toEqual({
        entityType: EntityType.Journal,
        mainButtonType: ButtonType.None,
        mainUrl: '',
        browzineUrl: 'https://browzine.com/libraries/XXX/journals/10292',
        showBrowzineButton: true,
        secondaryUrl: '', // journal, so content location not returned from getArticleLinkUrl
        showSecondaryButton: false, // passes secondary btn check, but no url so button still not shown
      });

      // Finally, we can assert that no other requests were made.
      httpTesting.verify();
    });

    describe('shouldMakeUnpaywallCall checks', () => {
      it('should make an Unpaywall api call if we have an article, unpaywalEnabled is true, we do not have an alert type button, avoidUnpaywall is false, unpaywallUsable is true, and we do not have directToPDF or articleLink urls', async () => {
        const articleWithoutUrls: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          documentDeliveryFulfillmentUrl: '',
        };

        const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);
        const articlePromise = firstValueFrom(buttonInfo$);

        const req = httpTesting.expectOne(articlePath);
        req.flush({
          data: articleWithoutUrls,
        });

        // Should make Unpaywall call
        const unpaywallReq = httpTesting.expectOne(
          `https://api.unpaywall.org/v2/10.1002%2Fijc.25451?email=info@thirdiron.com`
        );
        unpaywallReq.flush({
          data: {
            best_open_access_location: { url: 'https://unpaywall.org/pdf' },
          },
        });

        const result = await articlePromise;
        expect(result.mainButtonType).toBe(ButtonType.None);
        httpTesting.verify();
      });

      it('should make Unpaywall call when ApiResult has 404 status', () => {
        // Test the 404 condition by directly testing the shouldMakeUnpaywallCall method
        const mockApiResult: ApiResult = {
          body: {
            data: { doi: '10.1002/ijc.25451' } as any, // Include doi to pass isArticle check
          },
          status: 404,
          ok: false,
          url: 'test-url',
        };

        // Test that shouldMakeUnpaywallCall returns true for 404 status
        const shouldMakeCall = (service as any).shouldMakeUnpaywallCall(
          mockApiResult,
          EntityType.Article,
          ButtonType.None
        );
        expect(shouldMakeCall).toBeTrue();
      });

      it('should not make an Unpaywall api call if unpaywalEnabled is false', async () => {
        // Create a new test module with different config
        const mockConfig = { ...MOCK_MODULE_PARAMETERS };
        mockConfig.articlePDFDownloadViaUnpaywallEnabled = false;
        mockConfig.articleLinkViaUnpaywallEnabled = false;
        mockConfig.articleAcceptedManuscriptPDFViaUnpaywallEnabled = false;
        mockConfig.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = false;

        const testBed = await createTestModule(mockConfig);
        const testService = testBed.inject(ButtonInfoService);
        const testHttpTesting = testBed.inject(HttpTestingController);

        const articleWithoutUrls: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
          retractionNoticeUrl: '',
          documentDeliveryFulfillmentUrl: '',
        };

        const buttonInfo$ = testService.getDisplayInfo(articleSearchEntity);
        const articlePromise = firstValueFrom(buttonInfo$);

        const req = testHttpTesting.expectOne(articlePath);
        req.flush({
          data: articleWithoutUrls,
        });

        const result = await articlePromise;
        expect(result.mainButtonType).toBe(ButtonType.ExpressionOfConcern);

        // Should not make Unpaywall call
        testHttpTesting.verify();
      });

      it('should not make an Unpaywall api call if we have an alert type button', async () => {
        const articleWithRetraction: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
        };

        const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);
        const articlePromise = firstValueFrom(buttonInfo$);

        const req = httpTesting.expectOne(articlePath);
        req.flush({
          data: articleWithRetraction,
        });

        const result = await articlePromise;
        expect(result.mainButtonType).toBe(ButtonType.Retraction);

        // Should not make Unpaywall call due to alert button
        httpTesting.verify();
      });

      it('should not make an Unpaywall api call if avoidUnpaywall is true', async () => {
        const articleWithoutUrls: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          documentDeliveryFulfillmentUrl: '',
        };

        // Create a proper ApiResult object with meta property
        const mockedApiResult: ApiResult = {
          ...responseMetaData,
          body: {
            data: articleWithoutUrls,
          },
          meta: {
            avoidUnpaywall: true,
          },
        };

        // Test the displayWaterfall method directly
        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.mainButtonType).toBe(ButtonType.None);

        // Test that shouldMakeUnpaywallCall returns false due to avoidUnpaywall flag
        const shouldMakeCall = (service as any).shouldMakeUnpaywallCall(
          mockedApiResult,
          EntityType.Article,
          ButtonType.None
        );
        expect(shouldMakeCall).toBeFalse();
      });

      it('should not make an Unpaywall api call if unpaywallUsable is false', async () => {
        const articleWithoutUrls: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          // documentDeliveryFulfillmentUrl still has URL, so we show Document Delivery button
          unpaywallUsable: false,
        };

        const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);
        const articlePromise = firstValueFrom(buttonInfo$);

        const req = httpTesting.expectOne(articlePath);
        req.flush({
          data: articleWithoutUrls,
        });

        const result = await articlePromise;
        expect(result.mainButtonType).toBe(ButtonType.DocumentDelivery);

        // Should not make Unpaywall call due to unpaywallUsable: false
        httpTesting.verify();
      });

      it('should not make an Unpaywall api call if we have either a directToPDF or articleLink url', async () => {
        const articleWithDirectPDF: ArticleData = {
          ...articleData,
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
        };

        const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);
        const articlePromise = firstValueFrom(buttonInfo$);

        const req = httpTesting.expectOne(articlePath);
        req.flush({
          data: articleWithDirectPDF,
        });

        const result = await articlePromise;
        expect(result.mainButtonType).toBe(ButtonType.DirectToPDF);

        // Should not make Unpaywall call due to existing directToPDF url
        httpTesting.verify();
      });
    });
  });

  describe('#displayWaterfall', () => {
    describe('for Browzine (TOC) button', () => {
      it('should show Browzine button for Journal when browzineWebLink, browzineEnabled and user config setting are true', () => {
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...mockedJournalData }];

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        expect(buttonInfo.showBrowzineButton).toBeTrue();
        expect(buttonInfo.browzineUrl).toBe(
          'https://browzine.com/libraries/XXX/journals/10292' // use Journal browzineWebLink value
        );
      });
      it('should not show Browzine button for Journal when no browzineWebLink present', () => {
        const mockedJournalData: JournalData = {
          ...journalData[0],
          browzineWebLink: '',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...mockedJournalData }];

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
        expect(buttonInfo.browzineUrl).toBe('');
      });

      it('should not show Browzine button for Journal when browzineEnabled is false', () => {
        const mockedJournalData: JournalData = {
          ...journalData[0],
          browzineEnabled: false,
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...mockedJournalData }];

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });

      it('should not show Browzine button for Journal when user config setting is false', async () => {
        // Create a new test module with different config
        const mockConfig = { ...MOCK_MODULE_PARAMETERS };
        mockConfig.journalBrowZineWebLinkTextEnabled = false;

        const testBed = await createTestModule(mockConfig);
        const testService = testBed.inject(ButtonInfoService);

        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...mockedJournalData }];

        const { displayInfo: buttonInfo } = testService.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });
      it('should show Browzine button for Article when browzineWebLink, browzineEnabled and user config setting are true and directToPdf or articleLink urls present', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...mockedArticleData };
        mockedApiResult.body.included = { ...mockedJournalData };

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeTrue();
        expect(buttonInfo.browzineUrl).toBe(
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575'
        ); // TODO - @Karl, we only use the Article browzineWebLink value here, even if the included journal has this property?
      });
      it('should not show Browzine button for Article when no browzineWebLink present', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          browzineWebLink: '',
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...mockedArticleData };
        mockedApiResult.body.included = { ...mockedJournalData };

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });

      it('should not show Browzine button for Article when browzineEnabled is false', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
          browzineEnabled: false,
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...mockedArticleData };
        mockedApiResult.body.included = { ...mockedJournalData };

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });

      it('should not show Browzine button for Article when user config setting is false', async () => {
        // Create a new test module with different config
        const mockConfig = { ...MOCK_MODULE_PARAMETERS };
        mockConfig.articleBrowZineWebLinkTextEnabled = false;

        const testBed = await createTestModule(mockConfig);
        const testService = testBed.inject(ButtonInfoService);

        const mockedArticleData: ArticleData = {
          ...articleData,
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...mockedArticleData };
        mockedApiResult.body.included = { ...mockedJournalData };

        const { displayInfo: buttonInfo } = testService.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });

      it('should not show Browzine button for Article when neither directToPdf nor articleLink urls are present', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          fullTextFile: '',
          contentLocation: '',
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...mockedArticleData };
        mockedApiResult.body.included = { ...mockedJournalData };

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });
    });

    // based on config, we may show both the Download PDF and the Article Link buttons
    describe('for secondary (Article Link) button', () => {
      it('should not show secondary button if main button is an alert type', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // Keep retraction URL to trigger alert button
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.mainButtonType).toBe(ButtonType.Retraction);
        expect(buttonInfo.showSecondaryButton).toBeFalse();
        expect(buttonInfo.secondaryUrl).toBe('');
      });

      it('should not show secondary button if main button is already Article Link type', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          fullTextFile: '',
          // Keep contentLocation to trigger Article Link button
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.mainButtonType).toBe(ButtonType.ArticleLink);
        expect(buttonInfo.showSecondaryButton).toBeFalse();
        expect(buttonInfo.secondaryUrl).toBe('');
      });

      it('should show secondary button if config showFormatChoice is true', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          // Keep directToPDF to trigger main button that is not Article Link
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.mainButtonType).toBe(ButtonType.DirectToPDF);
        expect(buttonInfo.showSecondaryButton).toBeTrue();
        expect(buttonInfo.secondaryUrl).toBe(articleData.contentLocation);
      });

      it('should not show secondary button if config showFormatChoice is false', async () => {
        // Create a new test module with different config
        const mockConfig = { ...MOCK_MODULE_PARAMETERS };
        mockConfig.showFormatChoice = false;

        const testBed = await createTestModule(mockConfig);
        const testService = testBed.inject(ButtonInfoService);

        const mockedArticleData: ArticleData = {
          ...articleData,
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          // Keep directToPDF to trigger main button that is not Article Link
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = testService.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.mainButtonType).toBe(ButtonType.DirectToPDF);
        expect(buttonInfo.showSecondaryButton).toBeFalse();
        expect(buttonInfo.secondaryUrl).toBe('');
      });
    });

    describe('for the general button, with a Journal response', () => {
      it('should return Browzine button info and no article button info', () => {
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...mockedJournalData }];
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        const expectedValues = {
          browzineUrl: 'https://browzine.com/libraries/XXX/journals/10292',
          mainButtonType: ButtonType.None,
          entityType: EntityType.Journal,
          showBrowzineButton: true,
          mainUrl: '',
        };

        validateButton(buttonInfo, expectedValues);
      });

      it('should handle journal with no browzine data', () => {
        const journalWithoutBrowzine: JournalData = {
          ...journalData[0],
          browzineEnabled: true, // Keep true so journal isn't filtered out
          browzineWebLink: '', // Use empty string to test no browzine web link
        };

        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = [{ ...journalWithoutBrowzine }];

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Journal
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
        expect(buttonInfo.browzineUrl).toBe('');
      });
    });
    describe('for the general button, with an Article response without a Journal included', () => {
      it('should return a Retraction type button with corresponding link and image for Article with retraction url', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        // TODO @Karl - do we only show Browzine buttons for Journals or articles with included journal?
        // Would we have a browzineUrl on an article without an included journal as in this mock data?
        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.Retraction,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
        };

        validateButton(buttonInfo, expectedValues);
      });
      it('should return an Expression of Concern type button with corresponding link and image', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // make retraction url empty so we fall into EOC
          retractionNoticeUrl: '',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.ExpressionOfConcern,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451',
        };

        validateButton(buttonInfo, expectedValues);
      });
      it('should return a Problematic Journal type button with corresponding link and image', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // make previous waterfall steps empty so we fall into problematic journal
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.ProblematicJournalArticle,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'https://develop.libkey.io/libraries/1414/10.5897/JMA2014.0308',
        };

        validateButton(buttonInfo, expectedValues);
      });
      it('should return a Direct PDF link type button with corresponding link and image', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // make previous waterfall steps empty so we fall into Direct PDF link
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.DirectToPDF,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
        };

        validateButton(buttonInfo, expectedValues);
      });
      it('should return an Article link type button with corresponding link and image', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // make previous waterfall steps empty so we fall into Article Link
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          fullTextFile: '',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.ArticleLink,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'https://develop.browzine.com/libraries/XXX/articles/55134408',
        };

        validateButton(buttonInfo, expectedValues);
      });
      it('should return a Document Delivery type button with corresponding link and image', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          // make previous waterfall steps empty so we fall into Document Delivery
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
          fullTextFile: '',
          contentLocation: '',
          documentDeliveryFulfillmentUrl: 'test.document.delivery-url.com',
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = undefined;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.DocumentDelivery,
          entityType: EntityType.Article,
          showBrowzineButton: false, // false because null journal passed into waterfall
          mainUrl: 'test.document.delivery-url.com',
        };

        validateButton(buttonInfo, expectedValues);
      });
    });

    describe('for the general button, with an Article response with a Journal included', () => {
      it('should return a Direct PDF link type button and Browzine button when Journal supplied along with Article', () => {
        const mockedArticleData: ArticleData = {
          ...articleData,
          retractionNoticeUrl: '',
          expressionOfConcernNoticeUrl: '',
          problematicJournalArticleNoticeUrl: '',
        };
        const mockedJournalData: JournalData = {
          ...journalData[0],
        };
        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = mockedArticleData;
        mockedApiResult.body.included = mockedJournalData;

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        const expectedValues = {
          browzineUrl:
            'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
          mainButtonType: ButtonType.DirectToPDF,
          color: 'sys-primary',
          entityType: EntityType.Article,
          showBrowzineButton: true, // true because journal into passed along to waterfall
          mainUrl: 'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
        };

        validateButton(buttonInfo, expectedValues);
      });

      it('should handle article with included journal but no browzine data', () => {
        const testArticleData: ArticleData = {
          ...articleData,
        };
        const journalWithoutBrowzine: JournalData = {
          ...journalData[0],
          browzineEnabled: false, // Use false instead of undefined
        };

        const mockedApiResult: ApiResult = { ...responseMetaData };
        mockedApiResult.body.data = { ...testArticleData };
        mockedApiResult.body.included = { ...journalWithoutBrowzine };

        const { displayInfo: buttonInfo } = service.displayWaterfall(
          mockedApiResult,
          EntityType.Article
        );

        expect(buttonInfo.showBrowzineButton).toBeFalse();
      });
    });
  });

  // Additional test cases for edge cases and miscellaneous functionality
  describe('Edge cases and additional functionality', () => {
    it('should handle article with avoidUnpaywallPublisherLinks flag', async () => {
      const articleWithAvoidFlag: ArticleData = {
        ...articleData,
        avoidUnpaywallPublisherLinks: true,
        fullTextFile: '',
        contentLocation: '',
        retractionNoticeUrl: '',
        expressionOfConcernNoticeUrl: '',
        problematicJournalArticleNoticeUrl: '',
        documentDeliveryFulfillmentUrl: '',
      };

      const buttonInfo$ = service.getDisplayInfo(articleSearchEntity);
      const articlePromise = firstValueFrom(buttonInfo$);

      const req = httpTesting.expectOne(articlePath);
      req.flush({
        data: articleWithAvoidFlag,
      });

      // Should still make Unpaywall call but with avoidUnpaywallPublisherLinks flag
      const unpaywallReq = httpTesting.expectOne(
        `https://api.unpaywall.org/v2/10.1002%2Fijc.25451?email=info@thirdiron.com`
      );
      unpaywallReq.flush({
        data: {
          best_open_access_location: { url: 'https://unpaywall.org/pdf' },
        },
      });

      const result = await articlePromise;
      expect(result).toBeDefined();
      httpTesting.verify();
    });

    it('should return default response for unknown entity type', async () => {
      const unknownSearchEntity: SearchEntity = {
        pnx: {
          addata: {},
          display: {
            title: ['unknown entity'],
            type: ['unknown'],
          },
        },
      };

      const result$ = service.getDisplayInfo(unknownSearchEntity);
      const result = await firstValueFrom(result$);

      expect(result).toEqual({
        entityType: EntityType.Unknown,
        mainButtonType: ButtonType.None,
        mainUrl: '',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
      });
    });

    it('should return default response when entity type cannot be determined', async () => {
      const invalidSearchEntity: SearchEntity = {
        pnx: {
          addata: {},
          display: {
            title: ['invalid entity'],
            type: [],
          },
        },
      };

      const result$ = service.getDisplayInfo(invalidSearchEntity);
      const result = await firstValueFrom(result$);

      expect(result).toEqual({
        entityType: EntityType.Unknown,
        mainButtonType: ButtonType.None,
        mainUrl: '',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
      });
    });

    it('should handle article with no URLs and config disabled', async () => {
      // Create a new test module with different config
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.articlePDFDownloadLinkEnabled = false;
      mockConfig.articleLinkEnabled = false;
      mockConfig.articleRetractionWatchEnabled = false;
      mockConfig.articleExpressionOfConcernEnabled = false;
      mockConfig.documentDeliveryFulfillmentEnabled = false;
      mockConfig.articlePDFDownloadViaUnpaywallEnabled = false;
      mockConfig.articleLinkViaUnpaywallEnabled = false;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const articleWithNoUrls: ArticleData = {
        ...articleData,
        fullTextFile: '',
        contentLocation: '',
        retractionNoticeUrl: '',
        expressionOfConcernNoticeUrl: '',
        problematicJournalArticleNoticeUrl: '',
        documentDeliveryFulfillmentUrl: '',
      };

      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = articleWithNoUrls;
      mockedApiResult.body.included = undefined;

      const { displayInfo: buttonInfo } = testService.displayWaterfall(
        mockedApiResult,
        EntityType.Article
      );

      expect(buttonInfo.mainButtonType).toBe(ButtonType.None);
      expect(buttonInfo.mainUrl).toBe('');
      expect(buttonInfo.showBrowzineButton).toBeFalse();
      expect(buttonInfo.showSecondaryButton).toBeFalse();
    });

    it('should handle invalid API response data', () => {
      const invalidApiResult: ApiResult = {
        ...responseMetaData,
        body: {
          data: {} as any, // Use empty object instead of null
        },
      };

      const { displayInfo: buttonInfo } = service.displayWaterfall(
        invalidApiResult,
        EntityType.Article
      );

      expect(buttonInfo.mainButtonType).toBe(ButtonType.None);
      expect(buttonInfo.mainUrl).toBe('');
      expect(buttonInfo.entityType).toBe(EntityType.Unknown);
    });
  });

  describe('#buildStackOptions', () => {
    it('should build Third Iron main button when displayInfo has valid entity and button type', () => {
      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '',
      };

      const result = service.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(1);
      expect(result[0]).toEqual({
        source: 'thirdIron',
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        url: 'https://example.com/pdf',
        ariaLabel: '',
        label: '',
      });
    });

    it('should build Third Iron secondary button when showSecondaryButton is true', () => {
      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: 'https://example.com/article',
        showSecondaryButton: true,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '',
      };

      const result = service.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(2);
      expect(result[0]).toEqual({
        source: 'thirdIron',
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        url: 'https://example.com/pdf',
        ariaLabel: '',
        label: '',
      });
      expect(result[1]).toEqual({
        source: 'thirdIron',
        entityType: EntityType.Article,
        url: 'https://example.com/article',
        showSecondaryButton: true,
      });
    });

    it('should not build Third Iron button when entity type is Unknown', () => {
      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Unknown,
        mainButtonType: ButtonType.None,
        mainUrl: '',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '',
      };

      const result = service.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(0);
    });

    it('should not build Third Iron button when button type is None', () => {
      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.None,
        mainUrl: '',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '',
      };

      const result = service.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(0);
    });

    it('should build Primo online links when viewModel has onlineLinks and link optimizer is disabled', () => {
      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [
          {
            type: 'PDF',
            url: 'https://example.com/primo-pdf',
            source: 'quicklink',
            ariaLabel: 'Download PDF',
          },
          {
            type: 'HTML',
            url: 'https://example.com/primo-html',
            source: 'quicklink',
            ariaLabel: 'Read Online',
          },
        ],
        directLink: '',
      };

      const result = service.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(3); // 1 Third Iron + 2 Primo links
      expect(result[1]).toEqual({
        source: 'quicklink',
        entityType: 'PDF',
        url: 'https://example.com/primo-pdf',
        ariaLabel: 'Download PDF',
        label: 'Get PDF', // From mock translation service
      });
      expect(result[2]).toEqual({
        source: 'quicklink',
        entityType: 'HTML',
        url: 'https://example.com/primo-html',
        ariaLabel: 'Read Online',
        label: 'Read Online', // From mock translation service
      });
    });

    it('should not build Primo online links when link optimizer is enabled', async () => {
      // Create a new test module with link optimizer enabled
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.enableLinkOptimizer = true;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [
          {
            type: 'PDF',
            url: 'https://example.com/primo-pdf',
            source: 'quicklink',
          },
        ],
        directLink: '',
      };

      const result = testService.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(1); // Only Third Iron button, no Primo links
      expect(result[0].source).toBe('thirdIron');
    });

    it('should build direct link when viewModel has directLink and showLinkResolverLink is true', async () => {
      // Create a new test module with showLinkResolverLink enabled
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.showLinkResolverLink = true;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '/some/direct/link',
        ariaLabel: 'Direct link aria label',
      };

      const result = testService.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(2); // 1 Third Iron + 1 direct link
      expect(result[1]).toEqual({
        source: 'directLink',
        entityType: 'directLink',
        url: '/nde/some/direct/link&state=#nui.getit.service_viewit',
        ariaLabel: 'Direct link aria label',
        label: 'Other online options', // From mock translation service
      });
    });

    it('should build direct link with correct URL when directLink includes /nde', async () => {
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.showLinkResolverLink = true;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '/nde/some/direct/link',
        ariaLabel: 'Direct link aria label',
      };

      const result = testService.buildStackOptions(displayInfo, viewModel);

      expect(result[1].url).toBe('/nde/some/direct/link&state=#nui.getit.service_viewit');
    });

    it('should not build direct link when showLinkResolverLink is false', async () => {
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.showLinkResolverLink = false;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: '',
        showSecondaryButton: false,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [],
        directLink: '/some/direct/link',
        ariaLabel: 'Direct link aria label',
      };

      const result = testService.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(1); // Only Third Iron button, no direct link
      expect(result[0].source).toBe('thirdIron');
    });

    it('should handle complete stack with Third Iron, Primo links, and direct link', async () => {
      const mockConfig = { ...MOCK_MODULE_PARAMETERS };
      mockConfig.enableLinkOptimizer = false;
      mockConfig.showLinkResolverLink = true;

      const testBed = await createTestModule(mockConfig);
      const testService = testBed.inject(ButtonInfoService);

      const displayInfo: DisplayWaterfallResponse = {
        entityType: EntityType.Article,
        mainButtonType: ButtonType.DirectToPDF,
        mainUrl: 'https://example.com/pdf',
        secondaryUrl: 'https://example.com/article',
        showSecondaryButton: true,
        showBrowzineButton: false,
        browzineUrl: '',
      };

      const viewModel: any = {
        onlineLinks: [
          {
            type: 'PDF',
            url: 'https://example.com/primo-pdf',
            source: 'quicklink',
            ariaLabel: 'Download PDF',
          },
        ],
        directLink: '/some/direct/link',
        ariaLabel: 'Direct link aria label',
      };

      const result = testService.buildStackOptions(displayInfo, viewModel);

      expect(result).toHaveSize(4); // 1 Third Iron main + 1 Third Iron secondary + 1 Primo + 1 direct
      expect(result[0].source).toBe('thirdIron');
      expect(result[1].source).toBe('thirdIron');
      expect(result[1].showSecondaryButton).toBe(true);
      expect(result[2].source).toBe('quicklink');
      expect(result[3].source).toBe('directLink');
    });

    // TODO: add tests for browzine button once we add logic for this
  });
});
