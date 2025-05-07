import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ButtonInfoService } from './button-info.service';
import { ApiService } from './api.service';
import { EntityType } from '../shared/entity-type.enum';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { SearchEntity } from '../types/searchEntity.types';
import { firstValueFrom, of } from 'rxjs';

const baseUrl = 'https://public-api.thirdiron.com/public/v1/libraries/322';
const articlePath = `${baseUrl}/articles/doi/10.1002%2Fijc.25451?include=journal,library&access_token=dc14dee7-f4f3-4617-bd84-be027c3830c0`;
const journalPath = `${baseUrl}/search?issns=00284793&access_token=dc14dee7-f4f3-4617-bd84-be027c3830c0`;

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
  title:
    'New England Journal of Medicine reconsiders relationship with industry',
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
  fullTextFile:
    'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
  contentLocation:
    'https://develop.browzine.com/libraries/XXX/articles/55134408',
  retractionNoticeUrl:
    'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
  expressionOfConcernNoticeUrl:
    'https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451',
  problematicJournalArticleNoticeUrl:
    'https://develop.libkey.io/libraries/1414/10.5897/JMA2014.0308',
};

const responseMetaData = {
  body: {
    data: [...journalData],
  },
  ok: true,
  status: 200,
  url: 'third-iron.com',
};

const validateButton = (buttonInfo: ButtonInfo, expectedValues: ButtonInfo) => {
  expect(buttonInfo.ariaLabel).toBe(expectedValues.ariaLabel);
  expect(buttonInfo.browzineUrl).toBe(expectedValues.browzineUrl);
  expect(buttonInfo.buttonText).toBe(expectedValues.buttonText);
  expect(buttonInfo.color).toBe(expectedValues.color);
  expect(buttonInfo.entityType).toBe(expectedValues.entityType);
  expect(buttonInfo.icon).toBe(expectedValues.icon);
  expect(buttonInfo.showBrowzineButton).toBe(expectedValues.showBrowzineButton);
  expect(buttonInfo.url).toBe(expectedValues.url);
};

describe('ButtonInfoService', () => {
  let httpTesting: HttpTestingController;
  let service: ButtonInfoService;
  let apiService: ApiService;
  // let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        ButtonInfoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    // apiService = new ApiService(httpClientSpy);
    apiService = TestBed.inject(ApiService);
    service = TestBed.inject(ButtonInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getButtonInfo', () => {
    it('should make a call to the article endpoint for given doi based on entity obj', async () => {
      // request article info from api service
      const buttonInfo$ = service.getButtonInfo(articleSearchEntity);

      // `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
      // and creates a `Promise` of the response.
      const articlePromise = firstValueFrom(buttonInfo$);

      // At this point, the request is pending, and we can assert it was made
      // via the `HttpTestingController`:
      const req = httpTesting.expectOne(
        `${articlePath}`,
        'Request to load the article'
      );

      const mockedArticleData = {
        data: {
          ...articleData,
        },
      };

      // Flushing the request causes it to complete, delivering the result
      req.flush(mockedArticleData);

      expect(await articlePromise).toEqual({
        ariaLabel: 'Retracted Article',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Retracted Article',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'article-alert-icon',
        showBrowzineButton: false,
        url: 'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
      });

      // Finally, we can assert that no other requests were made.
      httpTesting.verify();
    });
    it('should make a call to the journal endpoint for given issn based on entity obj', async () => {
      // request journal info from api service
      const buttonInfo$ = service.getButtonInfo(journalSearchEntity);

      // `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
      // and creates a `Promise` of the response.
      const journalPromise = firstValueFrom(buttonInfo$);

      // At this point, the request is pending, and we can assert it was made
      // via the `HttpTestingController`:
      const req = httpTesting.expectOne(
        `${journalPath}`,
        'Request to load the article'
      );

      const mockedJournalData = {
        data: {
          ...journalData[0],
        },
      };

      // Flushing the request causes it to complete, delivering the result
      req.flush(mockedJournalData);

      expect(await journalPromise).toEqual({
        ariaLabel: '',
        browzineUrl: 'https://browzine.com/libraries/XXX/journals/10292',
        buttonText: '',
        color: 'sys-primary',
        entityType: EntityType.Journal,
        icon: '',
        showBrowzineButton: true,
        url: '',
      });

      // Finally, we can assert that no other requests were made.
      httpTesting.verify();
    });
  });

  describe('#displayWaterfall', () => {
    it('should return Browzine button info for Journal and no article button info', () => {
      const mockedJournalData: JournalData = {
        ...journalData[0],
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = [{ ...mockedJournalData }];

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Journal,
        mockedJournalData,
        null
      );

      const expectedValues = {
        ariaLabel: '',
        browzineUrl: 'https://browzine.com/libraries/XXX/journals/10292',
        buttonText: '',
        color: 'sys-primary',
        entityType: EntityType.Journal,
        icon: '',
        showBrowzineButton: true,
        url: '',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return a Retraction type button with corresponding link and image for Article with retraction url', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        null
      );

      // TODO @Karl - do we only show Browzine buttons for Journals or articles with included journal?
      // Would we have a browzineUrl on an article without an included journal as in this mock data?
      const expectedValues = {
        ariaLabel: 'Retracted Article',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Retracted Article',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'article-alert-icon',
        showBrowzineButton: false, // false because null journal passed into waterfall
        url: 'https://develop.libkey.io/libraries/1252/10.1155/2019/5730746',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return an Expression of Concern type button with corresponding link and image', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: '',
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        null
      );

      const expectedValues = {
        ariaLabel: 'Expression of Concern',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Expression of Concern',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'article-alert-icon',
        showBrowzineButton: false, // false because null journal passed into waterfall
        url: 'https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return a Problematic Journal type button with corresponding link and image', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: '',
        expressionOfConcernNoticeUrl: '',
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        null
      );

      const expectedValues = {
        ariaLabel: 'Problematic Journal',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Problematic Journal',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'article-alert-icon',
        showBrowzineButton: false, // false because null journal passed into waterfall
        url: 'https://develop.libkey.io/libraries/1414/10.5897/JMA2014.0308',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return a Direct PDF link type button with corresponding link and image', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: '',
        expressionOfConcernNoticeUrl: '',
        problematicJournalArticleNoticeUrl: '',
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        null
      );

      const expectedValues = {
        ariaLabel: 'Download PDF',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Download PDF',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'pdf-download-icon',
        showBrowzineButton: false, // false because null journal passed into waterfall
        url: 'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
      };

      validateButton(buttonInfo, expectedValues);
    });
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
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        mockedJournalData
      );

      const expectedValues = {
        ariaLabel: 'Download PDF',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Download PDF',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'pdf-download-icon',
        showBrowzineButton: true, // true because journal into passed along to waterfall
        url: 'https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return an Article link type button with corresponding link and image', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: '',
        expressionOfConcernNoticeUrl: '',
        problematicJournalArticleNoticeUrl: '',
        fullTextFile: '',
      };
      const mockedApiResult: ApiResult = { ...responseMetaData };
      mockedApiResult.body.data = { ...mockedArticleData };

      const buttonInfo: ButtonInfo = service.displayWaterfall(
        mockedApiResult,
        EntityType.Article,
        mockedArticleData,
        null
      );

      const expectedValues = {
        ariaLabel: 'Read Article',
        browzineUrl:
          'https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575',
        buttonText: 'Read Article',
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: 'article-link-icon',
        showBrowzineButton: false, // false because null journal passed into waterfall
        url: 'https://develop.browzine.com/libraries/XXX/articles/55134408',
      };

      validateButton(buttonInfo, expectedValues);
    });
    it('should return an Unpaywall provided link', () => {});
  });

  describe('#getBrowZineWebLink', () => {
    it('should return the browzineWebLink string from Journal', () => {
      const mockedJournalData: JournalData = {
        ...journalData[0],
        browzineWebLink: 'www.expected.web.link.com',
      };

      expect(service.getBrowZineWebLink(mockedJournalData)).toBe(
        'www.expected.web.link.com'
      );
    });
    it('should return the browzineWebLink string from Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        browzineWebLink: 'www.expected.web.link.com',
      };
      expect(service.getBrowZineWebLink(mockedArticleData)).toBe(
        'www.expected.web.link.com'
      );
    });
    it('should return empty string if browzineWebLink is undefined on Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
      };
      delete mockedArticleData.browzineWebLink;
      expect(service.getBrowZineWebLink(mockedArticleData)).toBe('');
    });
  });

  describe('#getBrowZineEnabled', () => {
    it('should return true for a Journal with browzineEnabled = true', () => {
      const mockedJournalData: JournalData = {
        ...journalData[0],
        browzineEnabled: true,
      };
      expect(
        service.getBrowZineEnabled(EntityType.Journal, mockedJournalData, null)
      ).toBeTrue();
    });
    it('should return false for a Journal with browzineEnabled = false', () => {
      const mockedJournalData: JournalData = {
        ...journalData[0],
        browzineEnabled: false,
      };
      expect(
        service.getBrowZineEnabled(EntityType.Journal, mockedJournalData, null)
      ).toBeFalse();
    });
    it('should return true for an Article with associated Journal data with browzineEnabled = true', () => {
      const mockedJournal: JournalData = {
        ...journalData[0],
        browzineEnabled: true,
      };
      expect(
        service.getBrowZineEnabled(
          EntityType.Article,
          articleData,
          mockedJournal
        )
      ).toBeTrue();
    });
    it('should return false for an Article with associated Journal data with browzineEnabled = false', () => {
      const mockedJournal: JournalData = {
        ...journalData[0],
        browzineEnabled: false,
      };

      expect(
        service.getBrowZineEnabled(
          EntityType.Article,
          articleData,
          mockedJournal
        )
      ).toBeFalse();
    });
  });

  describe('#getDirectToPDFUrl', () => {
    it('should return the fullTextFile string for an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        fullTextFile: 'www.expected.full.text.com',
      };
      expect(
        service.getDirectToPDFUrl(EntityType.Article, mockedArticleData)
      ).toBe('www.expected.full.text.com');
    });
    // TODO @Karl - is this logic expected?
    it('should return empty string if not an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        fullTextFile: 'www.expected.full.text.com',
      };
      expect(
        service.getDirectToPDFUrl(EntityType.Journal, mockedArticleData)
      ).toBe('');
    });
  });

  describe('#getArticleLinkUrl', () => {
    it('should return the contentLocation string for an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        contentLocation: 'www.expected.content.location.com',
      };
      expect(
        service.getArticleLinkUrl(EntityType.Article, mockedArticleData)
      ).toBe('www.expected.content.location.com');
    });
    it('should return empty string if not an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        contentLocation: 'www.expected.content.location.com',
      };
      expect(
        service.getArticleLinkUrl(EntityType.Journal, mockedArticleData)
      ).toBe('');
    });
  });

  describe('#getArticleRetractionUrl', () => {
    it('should return the retractionNoticeUrl string for an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: 'www.expected.retraction.url.com',
      };
      expect(
        service.getArticleRetractionUrl(EntityType.Article, mockedArticleData)
      ).toBe('www.expected.retraction.url.com');
    });
    it('should return empty string if not an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        retractionNoticeUrl: 'www.expected.retraction.url.com',
      };
      expect(
        service.getArticleRetractionUrl(EntityType.Journal, mockedArticleData)
      ).toBe('');
    });
  });

  describe('#getArticleEOCNoticeUrl', () => {
    it('should return the expressionOfConcernNoticeUrl string for an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        expressionOfConcernNoticeUrl: 'www.expected.eoc.url.com',
      };
      expect(
        service.getArticleEOCNoticeUrl(EntityType.Article, mockedArticleData)
      ).toBe('www.expected.eoc.url.com');
    });
    it('should return empty string if not an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        expressionOfConcernNoticeUrl: 'www.expected.eoc.url.com',
      };
      expect(
        service.getArticleEOCNoticeUrl(EntityType.Journal, mockedArticleData)
      ).toBe('');
    });
  });

  describe('#getProblematicJournalArticleNoticeUrl', () => {
    it('should return the contentLocation string for an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        problematicJournalArticleNoticeUrl: 'www.expected.problematic.url.com',
      };
      expect(
        service.getProblematicJournalArticleNoticeUrl(
          EntityType.Article,
          mockedArticleData
        )
      ).toBe('www.expected.problematic.url.com');
    });
    it('should return empty string if not an Article', () => {
      const mockedArticleData: ArticleData = {
        ...articleData,
        problematicJournalArticleNoticeUrl: 'www.expected.problematic.url.com',
      };
      expect(
        service.getProblematicJournalArticleNoticeUrl(
          EntityType.Journal,
          mockedArticleData
        )
      ).toBe('');
    });
  });
});
