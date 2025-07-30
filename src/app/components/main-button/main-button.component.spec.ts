import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainButtonComponent } from './main-button.component';
import { ComponentRef } from '@angular/core';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { IconType } from 'src/app/shared/icon-type.enum';
import { TranslateService } from '@ngx-translate/core';

// Minimal mock for TranslateService
const minimalMockTranslateService = {
  instant: (key: string) => {
    const translations: { [key: string]: string } = {
      'LibKey.articleRetractionWatchText': 'Retracted Article',
      'LibKey.articleExpressionOfConcernText': 'Expression of Concern',
      'LibKey.problematicJournalText': 'Problematic Journal',
      'LibKey.articlePDFDownloadLinkText': 'Download PDF',
      'LibKey.articleLinkText': 'Read Article',
      'LibKey.documentDeliveryFulfillmentText': 'Request PDF',
      'LibKey.articlePDFDownloadViaUnpaywallText':
        'Download PDF (via Unpaywall)',
      'LibKey.articleLinkViaUnpaywallText': 'Read Article (via Unpaywall)',
      'LibKey.articleAcceptedManuscriptPDFViaUnpaywallText':
        'Download PDF (Accepted Manuscript via Unpaywall)',
      'LibKey.articleAcceptedManuscriptArticleLinkViaUnpaywallText':
        'Read Article (Accepted Manuscript via Unpaywall)',
    };
    return translations[key] || key; // Return translation if exists, otherwise return the key
  },
};

const createTestModule = async (translateServiceMock: any) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [MainButtonComponent, BaseButtonComponent],
    providers: [{ provide: TranslateService, useValue: translateServiceMock }],
  });
  await TestBed.compileComponents();
  return TestBed;
};

const validateButtonProps = (
  buttonElement: HTMLElement,
  expectedValues: any
) => {
  const buttonTextSpan = buttonElement.querySelector(
    '[data-testid="ti-button-text"]'
  )!;
  const buttonAriaLabel = buttonElement
    .querySelector('button')
    ?.getAttribute('aria-label');
  const buttonUrl = buttonElement
    .querySelector('base-button')
    ?.getAttribute('ng-reflect-url');
  const buttonIcon = buttonElement.querySelector(
    '[data-testid="ti-svg-icon"]'
  )!;

  const iconColor = buttonIcon?.getAttribute('ng-reflect-color');
  const iconName = buttonIcon?.getAttribute('ng-reflect-name');

  expect(buttonAriaLabel).toContain(expectedValues.mainAriaLabel);
  expect(buttonTextSpan.textContent).toContain(expectedValues.mainButtonText);
  expect(iconColor).toContain(expectedValues.mainColor);
  expect(iconName).toContain(expectedValues.mainIcon);
  expect(buttonUrl).toContain(expectedValues.mainUrl);
};

describe('MainButtonComponent', () => {
  let component: MainButtonComponent;
  let componentRef: ComponentRef<MainButtonComponent>;
  let fixture: ComponentFixture<MainButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainButtonComponent, BaseButtonComponent],
      providers: [
        { provide: TranslateService, useValue: minimalMockTranslateService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MainButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have expected button properties for DirectToPDF', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.DirectToPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Download PDF',
      mainButtonText: 'Download PDF',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.DirectToPDF,
    });
  });

  it('should have expected button properties for ArticleLink', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ArticleLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Read Article',
      mainButtonText: 'Read Article',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleLink,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ArticleLink,
    });
  });

  it('should have expected button properties for Document Delivery', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.DocumentDelivery);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Request PDF',
      mainButtonText: 'Request PDF',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.DocumentDelivery,
    });
  });

  it('should have expected button properties for Retraction', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.Retraction);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Retracted Article',
      mainButtonText: 'Retracted Article',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.Retraction,
    });
  });

  it('should have expected button properties for Expression of Concern article', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ExpressionOfConcern);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Expression of Concern',
      mainButtonText: 'Expression of Concern',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ExpressionOfConcern,
    });
  });

  it('should have expected button properties for Problematic Journal', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ProblematicJournalArticle);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Problematic Journal',
      mainButtonText: 'Problematic Journal',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ProblematicJournalArticle,
    });
  });

  it('should have expected button properties for Unpaywall direct to pdf', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallDirectToPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Download PDF (via Unpaywall)',
      mainButtonText: 'Download PDF (via Unpaywall)',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.UnpaywallDirectToPDF,
    });
  });

  it('should have expected button properties for Unpaywall article link', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallArticleLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Read Article (via Unpaywall)',
      mainButtonText: 'Read Article (via Unpaywall)',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleLink,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.UnpaywallArticleLink,
    });
  });

  it('should have expected button properties for Unpaywall manuscript pdf', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallManuscriptPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Download PDF (Accepted Manuscript via Unpaywall)',
      mainButtonText: 'Download PDF (Accepted Manuscript via Unpaywall)',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.UnpaywallManuscriptPDF,
    });
  });

  it('should have expected button properties for Unpaywall manuscript link', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallManuscriptLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Read Article (Accepted Manuscript via Unpaywall)',
      mainButtonText: 'Read Article (Accepted Manuscript via Unpaywall)',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleLink,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.UnpaywallManuscriptLink,
    });
  });

  describe('Custom text behavior', () => {
    it('should display custom translation value when provided', async () => {
      // Create a mock with custom translation values
      const customMockTranslateService = {
        instant: (key: string) => {
          const customTranslations: { [key: string]: string } = {
            'LibKey.articlePDFDownloadLinkText': 'Custom Download Text', // just testing one key for PDF download here
          };
          return customTranslations[key];
        },
      };

      const testBed = await createTestModule(customMockTranslateService);
      const customFixture = testBed.createComponent(MainButtonComponent);
      const customComponentRef = customFixture.componentRef;

      // Test DirectToPDF with custom translation
      customComponentRef.setInput('url', 'www.test.com');
      customComponentRef.setInput('buttonType', ButtonType.DirectToPDF);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Custom Download Text');
    });

    it('should display fallback text when translation key is missing', async () => {
      // Create a mock that returns the key for missing translations
      const fallbackMockTranslateService = {
        instant: (key: string) => {
          // Only provide translation for one key, others will return the key itself
          const translations: { [key: string]: string } = {
            'LibKey.articlePDFDownloadLinkText': 'Download PDF', // Only this one has translation
          };
          return translations[key];
        },
      };

      const testBed = await createTestModule(fallbackMockTranslateService);
      const fallbackFixture = testBed.createComponent(MainButtonComponent);
      const fallbackComponentRef = fallbackFixture.componentRef;

      // Test ArticleLink with missing translation (should return the default text 'Read Article')
      fallbackComponentRef.setInput('url', 'www.test.com');
      fallbackComponentRef.setInput('buttonType', ButtonType.ArticleLink);
      fallbackFixture.autoDetectChanges();
      await fallbackFixture.whenStable();

      const fallbackButtonElement = fallbackFixture.nativeElement;
      const buttonTextSpan = fallbackButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Read Article');
    });

    it('should display custom translation for Retraction button', async () => {
      const customMockTranslateService = {
        instant: (key: string) => {
          const customTranslations: { [key: string]: string } = {
            'LibKey.articleRetractionWatchText': 'Custom Retraction Alert',
          };
          return customTranslations[key];
        },
      };

      const testBed = await createTestModule(customMockTranslateService);
      const customFixture = testBed.createComponent(MainButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.com');
      customComponentRef.setInput('buttonType', ButtonType.Retraction);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Custom Retraction Alert');
    });

    it('should display fallback for Expression of Concern when translation missing', async () => {
      const fallbackMockTranslateService = {
        instant: (key: string) => {
          // Don't provide translation for Expression of Concern
          const translations: { [key: string]: string } = {
            'LibKey.articlePDFDownloadLinkText': 'Download PDF', // Only this one has translation
          };
          return translations[key];
        },
      };

      const testBed = await createTestModule(fallbackMockTranslateService);
      const fallbackFixture = testBed.createComponent(MainButtonComponent);
      const fallbackComponentRef = fallbackFixture.componentRef;

      fallbackComponentRef.setInput('url', 'www.test.com');
      fallbackComponentRef.setInput(
        'buttonType',
        ButtonType.ExpressionOfConcern
      );
      fallbackFixture.autoDetectChanges();
      await fallbackFixture.whenStable();

      const fallbackButtonElement = fallbackFixture.nativeElement;
      const buttonTextSpan = fallbackButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Expression of Concern');
    });

    it('should display custom translation for Document Delivery button', async () => {
      const customMockTranslateService = {
        instant: (key: string) => {
          const customTranslations: { [key: string]: string } = {
            'LibKey.documentDeliveryFulfillmentText': 'Custom Document Request',
          };
          return customTranslations[key];
        },
      };

      const testBed = await createTestModule(customMockTranslateService);
      const customFixture = testBed.createComponent(MainButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.com');
      customComponentRef.setInput('buttonType', ButtonType.DocumentDelivery);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Custom Document Request');
    });
  });
});
