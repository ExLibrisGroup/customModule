import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

// Mock module parameters that can be reused across test files
export const MOCK_MODULE_PARAMETERS = {
  apiKey: 'a9c7fb8f-9758-4ff9-9dc9-fcb4cbf32724',
  libraryId: '222',
  articlePDFDownloadLinkEnabled: true,
  primoArticlePDFDownloadLinkEnabled: true,
  articleLinkEnabled: true,
  showFormatChoice: true,
  articleRetractionWatchEnabled: true,
  articleExpressionOfConcernEnabled: true,
  journalBrowZineWebLinkTextEnabled: true,
  journalCoverImagesEnabled: true,
  articleBrowZineWebLinkTextEnabled: true,
  documentDeliveryFulfillmentEnabled: true,
  showLinkResolverLink: true,
  enableLinkOptimizer: false,
  viewOption: 'no-stack',
  // Unpaywall-specific parameters
  unpaywallEmailAddressKey: 'info@thirdiron.com',
  articlePDFDownloadViaUnpaywallEnabled: true,
  articleLinkViaUnpaywallEnabled: true,
  articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
  articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
  //TODO: add all the other module parameters
};

const createTestModule = async (config: any) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      ConfigService,
      {
        provide: 'MODULE_PARAMETERS',
        useValue: config,
      },
    ],
  });
  await TestBed.compileComponents();
  return TestBed;
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

  describe('getIsUnpaywallEnabled', () => {
    it('should return true when any unpaywall parameter is enabled', () => {
      expect(service.getIsUnpaywallEnabled()).toBeTrue();
    });

    it('should return false when all unpaywall parameters are disabled', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadViaUnpaywallEnabled: false,
        articleLinkViaUnpaywallEnabled: false,
        articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.getIsUnpaywallEnabled()).toBeFalse();
    });

    it('should return true when at least one unpaywall parameter is enabled', async () => {
      const partialConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadViaUnpaywallEnabled: false,
        articleLinkViaUnpaywallEnabled: false,
        articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true, // Only this one enabled
      };

      const testBed = await createTestModule(partialConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.getIsUnpaywallEnabled()).toBeTrue();
    });
  });

  describe('showDirectToPDFLink', () => {
    it('should return true when articlePDFDownloadLinkEnabled is true', () => {
      expect(service.showDirectToPDFLink()).toBeTrue();
    });

    it('should return false when articlePDFDownloadLinkEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadLinkEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showDirectToPDFLink()).toBeFalse();
    });
  });

  describe('showArticleLink', () => {
    it('should return true when articleLinkEnabled is true', () => {
      expect(service.showArticleLink()).toBeTrue();
    });

    it('should return false when articleLinkEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleLinkEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showArticleLink()).toBeFalse();
    });
  });

  describe('showFormatChoice', () => {
    it('should return true when showFormatChoice is true', () => {
      expect(service.showFormatChoice()).toBeTrue();
    });

    it('should return false when showFormatChoice is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        showFormatChoice: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showFormatChoice()).toBeFalse();
    });
  });

  describe('showRetractionWatch', () => {
    it('should return true when articleRetractionWatchEnabled is true', () => {
      expect(service.showRetractionWatch()).toBeTrue();
    });

    it('should return false when articleRetractionWatchEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleRetractionWatchEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showRetractionWatch()).toBeFalse();
    });
  });

  describe('showExpressionOfConcern', () => {
    it('should return true when articleExpressionOfConcernEnabled is true', () => {
      expect(service.showExpressionOfConcern()).toBeTrue();
    });

    it('should return false when articleExpressionOfConcernEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleExpressionOfConcernEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showExpressionOfConcern()).toBeFalse();
    });
  });

  describe('showUnpaywallDirectToPDFLink', () => {
    it('should return true when articlePDFDownloadViaUnpaywallEnabled is true', () => {
      expect(service.showUnpaywallDirectToPDFLink()).toBeTrue();
    });

    it('should return false when articlePDFDownloadViaUnpaywallEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadViaUnpaywallEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showUnpaywallDirectToPDFLink()).toBeFalse();
    });
  });

  describe('showUnpaywallArticleLink', () => {
    it('should return true when articleLinkViaUnpaywallEnabled is true', () => {
      expect(service.showUnpaywallArticleLink()).toBeTrue();
    });

    it('should return false when articleLinkViaUnpaywallEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleLinkViaUnpaywallEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showUnpaywallArticleLink()).toBeFalse();
    });
  });

  describe('showUnpaywallManuscriptPDFLink', () => {
    it('should return true when articleAcceptedManuscriptPDFViaUnpaywallEnabled is true', () => {
      expect(service.showUnpaywallManuscriptPDFLink()).toBeTrue();
    });

    it('should return false when articleAcceptedManuscriptPDFViaUnpaywallEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleAcceptedManuscriptPDFViaUnpaywallEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showUnpaywallManuscriptPDFLink()).toBeFalse();
    });
  });

  describe('showUnpaywallManuscriptArticleLink', () => {
    it('should return true when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is true', () => {
      expect(service.showUnpaywallManuscriptArticleLink()).toBeTrue();
    });

    it('should return false when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showUnpaywallManuscriptArticleLink()).toBeFalse();
    });
  });

  describe('showJournalBrowZineWebLinkText', () => {
    it('should return true when journalBrowZineWebLinkTextEnabled is true', () => {
      expect(service.showJournalBrowZineWebLinkText()).toBeTrue();
    });

    it('should return false when journalBrowZineWebLinkTextEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        journalBrowZineWebLinkTextEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showJournalBrowZineWebLinkText()).toBeFalse();
    });
  });

  describe('showArticleBrowZineWebLinkText', () => {
    it('should return true when articleBrowZineWebLinkTextEnabled is true', () => {
      expect(service.showArticleBrowZineWebLinkText()).toBeTrue();
    });

    it('should return false when articleBrowZineWebLinkTextEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        articleBrowZineWebLinkTextEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showArticleBrowZineWebLinkText()).toBeFalse();
    });
  });

  describe('showJournalCoverImages', () => {
    it('should return true when journalCoverImagesEnabled is true', () => {
      expect(service.showJournalCoverImages()).toBeTrue();
    });

    it('should return false when journalCoverImagesEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        journalCoverImagesEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showJournalCoverImages()).toBeFalse();
    });
  });

  describe('showDocumentDeliveryFulfillment', () => {
    it('should return true when documentDeliveryFulfillmentEnabled is true', () => {
      expect(service.showDocumentDeliveryFulfillment()).toBeTrue();
    });

    it('should return false when documentDeliveryFulfillmentEnabled is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        documentDeliveryFulfillmentEnabled: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showDocumentDeliveryFulfillment()).toBeFalse();
    });
  });

  describe('showLinkResolverLink', () => {
    it('should return true when showLinkResolverLink is true', () => {
      expect(service.showLinkResolverLink()).toBeTrue();
    });

    it('should return false when showLinkResolverLink is false', async () => {
      const disabledConfig = {
        ...MOCK_MODULE_PARAMETERS,
        showLinkResolverLink: false,
      };

      const testBed = await createTestModule(disabledConfig);
      const testService = testBed.inject(ConfigService);

      expect(testService.showLinkResolverLink()).toBeFalse();
    });
  });

  describe('getApiUrl', () => {
    it('should return the correct API URL', () => {
      expect(service.getApiUrl()).toBe('https://public-api.thirdiron.com/public/v1/libraries/222');
    });
  });

  describe('getApiKey', () => {
    it('should return the correct API key', () => {
      expect(service.getApiKey()).toBe('a9c7fb8f-9758-4ff9-9dc9-fcb4cbf32724');
    });
  });

  describe('getEmailAddressKey', () => {
    it('should return the correct email address key', () => {
      expect(service.getEmailAddressKey()).toBe('info@thirdiron.com');
    });
  });

  describe('getViewOption', () => {
    it('should return StackPlusBrowzine when viewOption is set to stack-plus-browzine', async () => {
      const configWithStackPlusBrowzine = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: 'stack-plus-browzine',
      };

      const testBed = await createTestModule(configWithStackPlusBrowzine);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return SingleStack when viewOption is set to single-stack', async () => {
      const configWithSingleStack = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: 'single-stack',
      };

      const testBed = await createTestModule(configWithSingleStack);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('single-stack');
    });

    it('should return NoStack when viewOption is set to no-stack', async () => {
      const configWithNoStack = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: 'no-stack',
      };

      const testBed = await createTestModule(configWithNoStack);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('no-stack');
    });

    it('should return StackPlusBrowzine as default when viewOption is missing', async () => {
      const configWithoutViewOption = {
        ...MOCK_MODULE_PARAMETERS,
      };
      // Use type assertion to allow deletion
      delete (configWithoutViewOption as any).viewOption;

      const testBed = await createTestModule(configWithoutViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is null', async () => {
      const configWithNullViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: null,
      };

      const testBed = await createTestModule(configWithNullViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is undefined', async () => {
      const configWithUndefinedViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: undefined,
      };

      const testBed = await createTestModule(configWithUndefinedViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is an invalid value', async () => {
      const configWithInvalidViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: 'invalid-view-option',
      };

      const testBed = await createTestModule(configWithInvalidViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is empty string', async () => {
      const configWithEmptyViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: '',
      };

      const testBed = await createTestModule(configWithEmptyViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is a number', async () => {
      const configWithNumberViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: 123,
      };

      const testBed = await createTestModule(configWithNumberViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });

    it('should return StackPlusBrowzine when viewOption is an object', async () => {
      const configWithObjectViewOption = {
        ...MOCK_MODULE_PARAMETERS,
        viewOption: { someProperty: 'value' },
      };

      const testBed = await createTestModule(configWithObjectViewOption);
      const testService = testBed.inject(ConfigService);

      expect(testService.getViewOption()).toBe('stack-plus-browzine');
    });
  });

  describe('getBooleanParam error handling', () => {
    it('should return false when parameter is missing', async () => {
      const configWithoutParam = {
        ...MOCK_MODULE_PARAMETERS,
      };
      // Use type assertion to allow deletion
      delete (configWithoutParam as any).articlePDFDownloadLinkEnabled;

      const testBed = await createTestModule(configWithoutParam);
      const testService = testBed.inject(ConfigService);

      expect(testService.showDirectToPDFLink()).toBeFalse();
    });

    it('should return false when parameter is invalid JSON', async () => {
      const configWithInvalidParam = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadLinkEnabled: 'invalid-json',
      };

      const testBed = await createTestModule(configWithInvalidParam);
      const testService = testBed.inject(ConfigService);

      expect(testService.showDirectToPDFLink()).toBeFalse();
    });

    it('should return false when parameter is null', async () => {
      const configWithNullParam = {
        ...MOCK_MODULE_PARAMETERS,
        articlePDFDownloadLinkEnabled: null,
      };

      const testBed = await createTestModule(configWithNullParam);
      const testService = testBed.inject(ConfigService);

      expect(testService.showDirectToPDFLink()).toBeFalse();
    });
  });
});
